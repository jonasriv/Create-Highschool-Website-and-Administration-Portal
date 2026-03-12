/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/models/Test";
import TestSession from "@/models/TestSession";
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

    const { testId } = body;
    if (!testId) {
      return NextResponse.json({ error: "MISSING_TEST_ID" }, { status: 400 });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json({ error: "TEST_NOT_FOUND" }, { status: 404 });
    }

    if (test.teacherId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const session = await TestSession.create({
      teacherId: user.id,
      testId,
      status: "active",
      startedAt: new Date(),
      titleSnapshot: test.title,
      subjectSnapshot: test.subject,
    });

    return NextResponse.json(session);
  } catch (err) {
    const msg = String((err as any)?.message ?? err);
    if (msg === "NOT_TEACHER") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return authErrorToResponse(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await requireTeacher();

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    const query: any = { teacherId: user.id };
    if (testId) query.testId = testId;

    const sessions = await TestSession.find(query).sort({ createdAt: -1 });

    return NextResponse.json(sessions);
  } catch (err) {
    return authErrorToResponse(err);
  }
}