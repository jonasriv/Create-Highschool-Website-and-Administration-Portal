import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { verifyToken } from "@/app/admin/verifyToken";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authResult = await verifyToken(req);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { decoded } = authResult;
  if (!decoded || typeof decoded !== "object" || !("isAdmin" in decoded) || !decoded.isAdmin) {
    return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("prefix") ?? "news/"; // vi laster opp med news/...
    const cursor = searchParams.get("cursor") ?? undefined;

    const result = await list({
      prefix,
      cursor,
      limit: 100,
    });

    // result.blobs: [{ url, pathname, size, uploadedAt, ... }]
    return NextResponse.json({
      blobs: result.blobs,
      cursor: result.cursor ?? null,
      hasMore: Boolean(result.cursor),
    });
  } catch (err) {
    console.error("Blob list feilet:", err);
    return NextResponse.json({ error: "Kunne ikke hente bibliotek." }, { status: 500 });
  }
}
