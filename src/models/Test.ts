import mongoose, { Schema } from "mongoose";

export type QuestionType =
  | "short"
  | "long"
  | "multipleChoice";

export interface IQuestion {
  type: QuestionType;
  prompt: string; // selve delspørsmålet
  points: number;
  expectedElements?: string;
  rubric?: string;

  // v1: valgfritt – bare brukes hvis type === "multipleChoice"
  choices?: string[];
  correctChoiceIndex?: number;
}

export interface ISection {
  title?: string; // valgfritt: "Oppgave 1", "Kildeanalyse", osv.
  paragraphs: string[]; // fri tekst / kildetekst / forklaring (avsnitt)
  questions: IQuestion[]; // delspørsmål
}

export interface ITest {
  teacherId: string;
  title: string;
  subject: string;
  gradeLevel: "VG1" | "VG2" | "VG3";
  durationMinutes?: number;
  instructions?: string;
  status: "draft" | "published" | "archived";
  tasks: ISection[]; // (beholder navnet "tasks" for å minimere endringer i API/UI nå)
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: ["short", "long", "multipleChoice"],
      required: true,
      default: "long",
    },
    prompt: { type: String, required: false, default: "" },
    points: { type: Number, required: false, default: 1 },
    expectedElements: { type: String },
    rubric: { type: String },

    // multipleChoice (valgfritt i v1)
    choices: [{ type: String }],
    correctChoiceIndex: { type: Number },
  },
  { _id: true } // hver question får sin egen _id (enkelt for edit/delete)
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String },

    // “paragraphs”: fri tekst/kilder delt i avsnitt
    paragraphs: {
      type: [String],
      default: [],
    },

    // “questions”: delspørsmål
    questions: {
      type: [QuestionSchema],
      default: [],
    },
  },
  { _id: true } // hver seksjon/oppgave får _id
);

const TestSchema = new Schema<ITest>(
  {
    teacherId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: "" },
    subject: { type: String, required: true, default: "" },
    gradeLevel: { type: String, enum: ["VG1", "VG2", "VG3"], required: true },
    durationMinutes: { type: Number, required: false, default: 0 },
    instructions: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    // OBS: behold navnet "tasks" for minst mulig refactor nå
    tasks: {
      type: [SectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Test ||
  mongoose.model<ITest>("Test", TestSchema);
