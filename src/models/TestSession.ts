import mongoose, { Schema } from "mongoose";

export type SessionStatus = "draft" | "active" | "ended";

export interface ITestSession {
  teacherId: string;       // samme type som Test.teacherId (string)
  testId: string;          // Test._id som string
  status: SessionStatus;

  // “kontekst”
  titleSnapshot?: string;  // valgfritt, for historikk selv om testen endres senere
  subjectSnapshot?: string;

  // tidsstyring
  startedAt?: Date;
  endedAt?: Date;

  // adgang / kontroll
  pinCode?: string;        // f.eks. "4821"
  allowLateSubmit?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const TestSessionSchema = new Schema<ITestSession>(
  {
    teacherId: { type: String, required: true, index: true },
    testId: { type: String, required: true, index: true },

    status: {
      type: String,
      enum: ["draft", "active", "ended"],
      default: "draft",
      required: true,
      index: true,
    },

    titleSnapshot: { type: String },
    subjectSnapshot: { type: String },

    startedAt: { type: Date },
    endedAt: { type: Date },

    pinCode: { type: String },
    allowLateSubmit: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Typiske queries:
// - aktive sessions for lærer
TestSessionSchema.index({ teacherId: 1, status: 1, createdAt: -1 });
// - alle sessions for en test
TestSessionSchema.index({ testId: 1, createdAt: -1 });

export default mongoose.models.TestSession ||
  mongoose.model<ITestSession>("TestSession", TestSessionSchema);