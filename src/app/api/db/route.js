// app/api/db/route.js
import dbConnect from "@/lib/mongoose";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(req) {
  try {
    await dbConnect(); // Koble til databasen
    return new Response(JSON.stringify({ message: "Database connection successful!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to connect to database" }),
      { status: 500 }
    );
  }
}
