
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

FeedbackSchema.index({ userId: 1, updatedAt: -1 });

export type FeedbackDoc = InferSchemaType<typeof FeedbackSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default (mongoose.models.Feedback as mongoose.Model<FeedbackDoc>) ||
  mongoose.model<FeedbackDoc>("Feedback", FeedbackSchema);
