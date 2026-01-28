
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const NoteSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: "Nytt notat" },
    content: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, updatedAt: -1 });

export type NoteDoc = InferSchemaType<typeof NoteSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default (mongoose.models.Note as mongoose.Model<NoteDoc>) ||
  mongoose.model<NoteDoc>("Note", NoteSchema);
