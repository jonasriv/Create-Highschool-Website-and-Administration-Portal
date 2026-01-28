/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import MsAccount from "@/models/MsAccount";
import { authOptions } from "@/lib/auth/authOptions";

async function refreshAccessToken(ms: any) {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: process.env.AZURE_AD_CLIENT_ID!,
    client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token: ms.refreshToken,
    scope: "openid profile email offline_access Calendars.Read",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    return { ok: false, data };
  }

  // NB: expires_in er sekunder fra nå
  const newExpiresAt = Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600);

  // Noen ganger får du ny refresh_token, noen ganger ikke
  const newRefreshToken = data.refresh_token ?? ms.refreshToken;

  return {
    ok: true,
    accessToken: data.access_token as string,
    refreshToken: newRefreshToken as string,
    expiresAt: newExpiresAt,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    await dbConnect();
  } catch {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }
  
  const ms = await MsAccount.findOne({ feideEmail: email });
  if (!ms) return NextResponse.json({ error: "Microsoft not connected" }, { status: 400 });

  // ✅ Refresh hvis token er utløpt (eller nær utløpt)
  const now = Math.floor(Date.now() / 1000);
  const needsRefresh = !ms.expiresAt || ms.expiresAt < now + 60;

  if (needsRefresh) {
    const refreshed = await refreshAccessToken(ms);
    if (!refreshed.ok) {
      // Hvis refresh feiler (revoked, policy etc), da må bruker koble på nytt
      return NextResponse.json(
        { error: "Microsoft session expired. Please reconnect.", details: refreshed.data },
        { status: 401 }
      );
    }

    ms.accessToken = refreshed.accessToken;
    ms.refreshToken = refreshed.refreshToken;
    ms.expiresAt = refreshed.expiresAt;
    await ms.save();
  }

  // Nå har vi gyldig access token
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 14);

  const url =
    "https://graph.microsoft.com/v1.0/me/calendarView" +
    `?startDateTime=${encodeURIComponent(start.toISOString())}` +
    `&endDateTime=${encodeURIComponent(end.toISOString())}` +
    `&$top=50&$orderby=start/dateTime`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${ms.accessToken}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}
