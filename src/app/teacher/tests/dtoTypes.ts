// src/app/teacher/tests/dtoTypes.ts
export type Status = "draft" | "published" | "archived";
export type QuestionType = "short" | "long" | "multipleChoice";

export type QuestionDto = {
  _id?: string;
  type: QuestionType;
  prompt: string;
  points: number;
  expectedElements?: string;
  rubric?: string;
  choices?: string[];
  correctChoiceIndex?: number;
};

export type SectionDto = {
  _id?: string;
  title?: string;
  paragraphs: string[];       // ✅ matcher DB
  questions: QuestionDto[];
};

export type TestDto = {
  _id?: string;
  teacherId?: string;
  title?: string;
  subject?: string;
  gradeLevel?: "VG1" | "VG2" | "VG3";
  durationMinutes?: number;
  instructions?: string;
  status?: Status;
  tasks: SectionDto[];
  updatedAt?: string;
  createdAt?: string;
};