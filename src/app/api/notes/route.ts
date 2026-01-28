import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { getUserIdOrThrow, authErrorToResponse } from "../auth/getCurrentUserOrThrow";


export const runtime = "nodejs";

export async function GET() {
  const userId = await getUserIdOrThrow();
  await dbConnect();

  const notes = await Note.find({ userId })
    .sort({ updatedAt: -1 })
    .select({ title: 1, updatedAt: 1, createdAt: 1 })
    .lean();

  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdOrThrow();

    const body = await req.json().catch(() => ({}));
    const title =
      typeof body?.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Nytt notat";

    await dbConnect();

    const note = await Note.create({ userId, title, content: "" });

    return NextResponse.json(
      {
        note: {
          _id: String(note._id),
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
      },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("POST /api/notes failed:", err);
    return authErrorToResponse(err);
  }
}
