import mongoose, { Schema } from "mongoose";

export type SubmissionStatus = "in-progress" | "submitted";

export type AnswerValue =
  | string
  | number
  | string[]
  | { choiceIndex?: number; text?: string }
  | null;

export interface IAnswer {
  sectionIndex: number;
  questionIndex: number;
  value: AnswerValue;

  // valgfritt: metadata
  updatedAt?: Date;
}

export interface ISubmission {
  teacherId: string;        // gjør lærer-queries raske
  testId: string;           // hvilken testmal
  testSessionId: string;    // hvilken gjennomføring
  studentId: string;        // Feide sub/uid (string)
  studentName?: string;     // snapshot (valgfritt)
  studentEmail?: string;    // snapshot (valgfritt)

  status: SubmissionStatus;
  startedAt?: Date;
  submittedAt?: Date;

  answers: IAnswer[];

  // vurdering (kan brukes senere)
  grade?: number;
  feedback?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    sectionIndex: { type: Number, required: true },
    questionIndex: { type: Number, required: true },
    value: { type: Schema.Types.Mixed, default: null }, // Mixed lar deg ha string/choiceIndex/etc.
    updatedAt: { type: Date },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    teacherId: { type: String, required: true, index: true },
    testId: { type: String, required: true, index: true },
    testSessionId: { type: String, required: true, index: true },

    studentId: { type: String, required: true, index: true },
    studentName: { type: String },
    studentEmail: { type: String },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
      required: true,
      index: true,
    },

    startedAt: { type: Date },
    submittedAt: { type: Date },

    answers: { type: [AnswerSchema], default: [] },

    grade: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

// Én submission per (session + student)
SubmissionSchema.index({ testSessionId: 1, studentId: 1 }, { unique: true });

// Monitor queries:
// - alle submissions i session, sortér på status/oppdatert
SubmissionSchema.index({ testSessionId: 1, status: 1, updatedAt: -1 });

// Læreroversikt:
// - alle submissions for lærer
SubmissionSchema.index({ teacherId: 1, createdAt: -1 });

// Elev “min historikk”:
SubmissionSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);