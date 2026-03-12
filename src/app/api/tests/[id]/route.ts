/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/models/Test";
import { getUserOrThrow, authErrorToResponse } from "../../auth/getCurrentUserOrThrow";
import { isTeacherEmail } from "@/lib/isTeacher";

async function requireTeacher() {
  const { id, email } = await getUserOrThrow();
  const ok = await isTeacherEmail(email);
  if (!ok) throw new Error("NOT_TEACHER");
  return { id, email };
}

type Ctx = { params: Promise<{ id: string }> };

function sanitizeTasks(tasks: any) {
  if (!Array.isArray(tasks)) return [];

  return tasks.map((s) => ({
    title: typeof s?.title === "string" ? s.title : "",
    paragraphs: Array.isArray(s?.paragraphs)
      ? s.paragraphs.map((p: any) => (typeof p === "string" ? p : String(p?.text ?? "")))
      : [],
    questions: Array.isArray(s?.questions)
      ? s.questions.map((q: any) => ({
          type: q?.type ?? "long",
          prompt: typeof q?.prompt === "string" ? q.prompt : "",   
          points: typeof q?.points === "number" ? q.points : 1,
          expectedElements: q?.expectedElements,
          rubric: q?.rubric,
          choices: q?.choices,
          correctChoiceIndex: q?.correctChoiceIndex,
        }))
      : [],
  }));
}

function pickUpdate(body: any) {
  return {
    title: body.title,
    subject: body.subject,
    gradeLevel: body.gradeLevel,
    durationMinutes: body.durationMinutes,
    instructions: body.instructions,
    status: body.status,
    tasks: typeof body.tasks === "undefined" ? undefined : sanitizeTasks(body.tasks),
  };
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    await dbConnect();
    const user = await requireTeacher();
    const { id } = await ctx.params;

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    if (test.teacherId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    return NextResponse.json(test);
  } catch (err) {
    const msg = String((err as any)?.message ?? err);
    if (msg === "NOT_TEACHER") {
      return NextResponse.json({ error: "UNAUTHORIZED", message: msg }, { status: 401 });
    }
    return authErrorToResponse(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  

  try {
  
    const body = await req.json();
  
    await dbConnect();
    const user = await requireTeacher();
    const { id } = await ctx.params;

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    if (test.teacherId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const patch = pickUpdate(body);

    for (const [k, v] of Object.entries(patch)) {
      if (typeof v !== "undefined") (test as any)[k] = v;
    }

    const saved = await test.save();
    return NextResponse.json(saved);
  } catch (err) {
    console.log("PATCH error raw:", err);
    return NextResponse.json(
      {
        error: "PATCH_FAILED",
        message: String((err as any)?.message ?? err),
        name: (err as any)?.name,
        errors: (err as any)?.errors,
      },
      { status: 500 }
    );
  }
}