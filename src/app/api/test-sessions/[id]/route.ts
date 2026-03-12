/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import TestSession from "@/models/TestSession";
import { getUserOrThrow, authErrorToResponse } from "../../auth/getCurrentUserOrThrow";
import { isTeacherEmail } from "@/lib/isTeacher";

async function requireTeacher() {
  const { id, email } = await getUserOrThrow();
  const ok = await isTeacherEmail(email);
  if (!ok) throw new Error("NOT_TEACHER");
  return { id };
}

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, ctx: Ctx) {
  try {
    await dbConnect();
    const user = await requireTeacher();
    const { id } = await ctx.params;

    const session = await TestSession.findById(id);
    if (!session) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (session.teacherId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    session.status = "ended";
    session.endedAt = new Date();

    const saved = await session.save();
    return NextResponse.json(saved);
  } catch (err) {
    return authErrorToResponse(err);
  }
}