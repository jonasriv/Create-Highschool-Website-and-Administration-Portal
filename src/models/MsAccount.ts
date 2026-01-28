import mongoose, { Schema } from "mongoose";

const MsAccountSchema = new Schema(
  {
    feideEmail: { type: String, required: true, index: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Number, required: true }, // seconds since epoch
  },
  { timestamps: true }
);

export default mongoose.models.MsAccount ||
  mongoose.model("MsAccount", MsAccountSchema);
