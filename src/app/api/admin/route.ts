import dbConnect from "@/lib/mongoose";
import Admin from "@/models/admin";
import Application from "@/models/application";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export async function POST(req: Request) {
  await dbConnect();

  const { username, password } = await req.json();

  // Finn admin-brukeren i databasen
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // Sjekk om passordet eksisterer i databasen
  if (!admin.password) {
    return NextResponse.json({ error: "No password set for this user" }, { status: 401 });
  }

  // Sammenlign passordet som er sendt med det hashede passordet i databasen
  try {
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    console.log("Is password valid: ", isPasswordValid); // Legg til logging av resultatet fra bcrypt.compare()

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Generer JWT-token hvis passordet er gyldig
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return NextResponse.json({ token });

  } catch (error) {
    console.error("Error comparing password:", error);
    return NextResponse.json({ error: "Error comparing password" }, { status: 500 });
  }
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
