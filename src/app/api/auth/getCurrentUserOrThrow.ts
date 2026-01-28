/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { NextResponse } from "next/server";

export async function getUserIdOrThrow() {
  const session = await getServerSession(authOptions);

  // Debug i dev (kan fjernes senere)
  if (process.env.NODE_ENV !== "production") {
    console.log("API session:", session?.user);
  }

  const id = (session?.user as any)?.id as string | undefined;

  if (!session) {
    // session mangler helt
    throw new Error("NO_SESSION");
  }
  if (!id) {
    // session finnes, men user.id mangler
    throw new Error("NO_USER_ID");
  }

  return id;
}

// Hjelper for route handlers:
export function authErrorToResponse(err: unknown) {
  const msg = String((err as any)?.message ?? err);
  if (msg === "NO_SESSION" || msg === "NO_USER_ID") {
    return NextResponse.json({ error: "unauthorized", message: msg }, { status: 401 });
  }
  return NextResponse.json({ error: "failed", message: msg }, { status: 500 });
}
