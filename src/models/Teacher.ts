// models/Teacher.ts
import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

function normalizeEmail(email: string) {
  return (email || "").trim().toLowerCase();
}

const TeacherSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    active: { type: Boolean, default: true },

    displayName: { type: String },
    addedByEmail: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);


TeacherSchema.pre("validate", function (next) {
 
  if (this.email) this.email = normalizeEmail(this.email);
  next();
});

export type Teacher = InferSchemaType<typeof TeacherSchema>;

export const TeacherModel: Model<Teacher> =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
