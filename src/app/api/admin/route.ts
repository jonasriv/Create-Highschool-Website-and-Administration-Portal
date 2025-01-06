
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/admin";
import Application from "@/models/application";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export async function POST(req: Request) {
  await dbConnect();

  const username = await req.json();

  const admin = await Admin.findOne({ username });
 
  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return NextResponse.json({ token });
}

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized "}, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    await dbConnect();

    const applications = await Application.find({});
    console.log("Applications found:", applications);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}