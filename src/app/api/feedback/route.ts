/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Feedback from "@/models/Feedback";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      feedbacks: feedbacks.map((f: any) => ({
        _id: String(f._id),
        name: f.name,
        content: f.content,
        anonymous: Boolean(f.anonymous),
        createdAt: f.createdAt,
      })),
    });
  } catch (err) {
    console.error("GET /api/feedback failed:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {


    const body = await req.json().catch(() => ({}));
    const name = String(body.name.trim());
    const content = String(body.content.trim());
 
    if (!content) {
        return NextResponse.json({ message: "Content required"}, { status: 400 });
    }
    await dbConnect();

    const feedback = await Feedback.create({ name, content });

    return NextResponse.json(
      {
        feedback: {
          _id: String(feedback._id),
          name: feedback.name,
          content: feedback.content,
          createdAt: feedback.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("POST /api/feedback failed:", err);
    return NextResponse.json({ message: "Error", status: 500 });
  }
}
