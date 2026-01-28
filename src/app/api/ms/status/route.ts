import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import dbConnect from "@/lib/mongoose";
import MsAccount from "@/models/MsAccount";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ connected: false }, { status: 401 });

  try {
    await dbConnect();
    const existing = await MsAccount.findOne({ feideEmail: email }).select("_id").lean();
    return NextResponse.json({ connected: Boolean(existing) });
  } catch {
    // DB nede -> ikke krasj UI
    return NextResponse.json({ connected: false, degraded: true });
  }
}
