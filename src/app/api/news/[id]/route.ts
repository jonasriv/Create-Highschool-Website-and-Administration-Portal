import dbConnect from "@/lib/mongoose";
import News from "@/models/news";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/admin/verifyToken";
import { del } from "@vercel/blob";

export async function DELETE(req: NextRequest) {
  const authResult = verifyToken(req);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { decoded } = authResult;
  if (!decoded || typeof decoded !== "object" || !("isAdmin" in decoded) || !decoded.isAdmin) {
    return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  }

  const id: string = req.nextUrl.pathname.split("/").pop()!;

  try {
    await dbConnect();

    const existing = await News.findById(id);
    if (!existing) return NextResponse.json({ message: "Nyheten ble ikke funnet." }, { status: 404 });

    // 1) slett blob (best effort)
    const url = existing.news_image as string | undefined;
    if (url) {
      try {
        await del(url);
      } catch (err) {
        console.error("Kunne ikke slette blob:", { id, url, err });
      }
    }

    // 2) slett doc
    await News.findByIdAndDelete(id);

    return NextResponse.json({ message: "Nyheten ble slettet." }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Kunne ikke slette nyheten." }, { status: 500 });
  }
}
