// lib/isTeacher.ts
import { TeacherModel } from "@/models/Teacher";

export async function isTeacherEmail(email?: string | null) {
  if (!email) return false;
  const teacher = await TeacherModel.findOne({
    email: email.trim().toLowerCase(),
    active: true,
  }).lean();
  return !!teacher;
}
