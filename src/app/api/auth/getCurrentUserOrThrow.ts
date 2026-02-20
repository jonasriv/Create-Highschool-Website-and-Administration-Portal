/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { NextResponse } from "next/server";

export async function getUserOrThrow() {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("NO_SESSION");

  const user = session.user as any;
  const id = user?.id as string | undefined;
  const email = user?.email as string | undefined;

  if (!id) throw new Error("NO_USER_ID");
  if (!email) throw new Error("NO_USER_EMAIL");

  return { id, email, session };
}

export async function getUserIdOrThrow() {
  const { id } = await getUserOrThrow();
  return id;
}

export function authErrorToResponse(err: unknown) {
  const msg = String((err as any)?.message ?? err);
  if (msg === "NO_SESSION" || msg === "NO_USER_ID" || msg === "NO_USER_EMAIL") {
    return NextResponse.json({ error: "unauthorized", message: msg }, { status: 401 });
  }
  return NextResponse.json({ error: "failed", message: msg }, { status: 500 });
}
