// src/app/api/tests/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/models/Test";
import { getUserOrThrow, authErrorToResponse } from "../auth/getCurrentUserOrThrow";
import { isTeacherEmail } from "@/lib/isTeacher";

async function requireTeacher() {
  const { id, email } = await getUserOrThrow();
  const ok = await isTeacherEmail(email);
  if (!ok) throw new Error("NOT_TEACHER");
  return { id, email };
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await requireTeacher();
    const body = await req.json();

    const test = await Test.create({
      teacherId: user.id,
      title: body.title ?? "",
      subject: body.subject ?? "",
      gradeLevel: body.gradeLevel ?? "VG1",
      durationMinutes: body.durationMinutes ?? 0,
      instructions: body.instructions ?? "",
      status: body.status ?? "draft",
      tasks: body.tasks ?? [],
    });

    return NextResponse.json(test);
  } catch (err) {
    const msg = String((err as any)?.message ?? err);
    if (msg === "NOT_TEACHER") {
      return NextResponse.json({ error: "UNAUTHORIZED", message: msg }, { status: 401 });
    }
    return authErrorToResponse(err);
  }
}

export async function GET() {
  try {
    await dbConnect();
    const user = await requireTeacher();
    const tests = await Test.find({ teacherId: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(tests);
  } catch (err) {
    const msg = String((err as any)?.message ?? err);
    if (msg === "NOT_TEACHER") {
      return NextResponse.json({ error: "UNAUTHORIZED", message: msg }, { status: 401 });
    }
    return authErrorToResponse(err);
  }
}