/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Submission from "@/models/Submission";
import { getUserOrThrow, authErrorToResponse } from "../auth/getCurrentUserOrThrow";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserOrThrow();

    const { searchParams } = new URL(req.url);
    const testSessionId = searchParams.get("testSessionId");

    if (!testSessionId) {
      return NextResponse.json({ error: "MISSING_SESSION_ID" }, { status: 400 });
    }

    const submissions = await Submission.find({ testSessionId }).sort({ updatedAt: -1 });

    return NextResponse.json(submissions);
  } catch (err) {
    return authErrorToResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserOrThrow();
    const body = await req.json();

    const {
      testId,
      testSessionId,
      answers,
      status,
    } = body;

    const submission = await Submission.findOneAndUpdate(
      {
        testSessionId,
        studentId: user.id,
      },
      {
        testId,
        testSessionId,
        studentId: user.id,
        studentEmail: user.email,
        answers,
        status: status ?? "in-progress",
        submittedAt: status === "submitted" ? new Date() : undefined,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(submission);
  } catch (err) {
    return authErrorToResponse(err);
  }
}