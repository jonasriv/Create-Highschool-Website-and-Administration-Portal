import dbConnect from "@/lib/mongoose";
import Admin from "@/models/admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

// POST: Autentisering
export async function POST(req: Request) {
    if (!JWT_SECRET) {
    console.error("JWT_SECRET mangler i miljøvariablene");
    return NextResponse.json(
      { error: "Serverkonfigurasjon mangler (JWT_SECRET)" },
      { status: 500 }
    );
  }

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

    

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Generer JWT-token hvis passordet er gyldig
    if (JWT_SECRET) {
      const token = jwt.sign({ 
          id: admin._id, 
          username: admin.username ,
          isAdmin: admin.isAdmin
          
        }, JWT_SECRET, {
        expiresIn: "2h",
      });
      return NextResponse.json({ token });
    } else {
      throw new Error("Feil med autentisering");
    }
  } catch (error) {
    console.error("Error comparing password:", error);
    return NextResponse.json({ error: "Error comparing password" }, { status: 500 });
  }
}


