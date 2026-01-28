import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { getUserIdOrThrow } from "../../auth/getCurrentUserOrThrow";

export const runtime = "nodejs";

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdOrThrow();
  const { id: noteId } = await params;


  if (!isValidObjectId(noteId)) {
    return NextResponse.json({ error: "bad_id" }, { status: 400 });
  }

  await dbConnect();

  const note = await Note.findOne({ _id: noteId, userId }).lean();
  if (!note) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    note: {
      _id: String(note._id),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  });
}

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdOrThrow();
  const { id: noteId } = await params;

  if (!isValidObjectId(noteId)) {
    return NextResponse.json({ error: "bad_id" }, { status: 400 });
  }

  const body = await _req.json().catch(() => ({}));
  const title =
    typeof body?.title === "string" ? body.title.trim().slice(0, 120) : undefined;
  const content =
    typeof body?.content === "string" ? body.content.slice(0, 50_000) : undefined;

  await dbConnect();

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
    },
    { new: true }
  ).lean();

  if (!note) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    note: {
      _id: String(note._id),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserIdOrThrow();
  const noteId = params.id;

  if (!isValidObjectId(noteId)) {
    return NextResponse.json({ error: "bad_id" }, { status: 400 });
  }

  await dbConnect();

  const res = await Note.deleteOne({ _id: noteId, userId });
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
