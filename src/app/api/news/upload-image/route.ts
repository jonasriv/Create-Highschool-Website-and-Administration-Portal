import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken } from "@/app/admin/verifyToken";

export const runtime = "nodejs"; // viktig for blob i route handlers

export async function POST(req: NextRequest) {
  const authResult = await verifyToken(req);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { decoded } = authResult;
  if (!decoded || typeof decoded !== "object" || !("isAdmin" in decoded) || !decoded.isAdmin) {
    return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Mangler fil." }, { status: 400 });
    }

    // valgfritt: begrens filtype/størrelse
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Kun bildefiler er tillatt." }, { status: 400 });
    }

    const filename = `news/${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });

    // blob.url er den du lagrer i DB
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error("Upload til Vercel Blob feilet:", err);
    return NextResponse.json({ error: "Kunne ikke laste opp bilde." }, { status: 500 });
  }
}
