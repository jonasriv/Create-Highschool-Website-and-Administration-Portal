export type Task = {
    type?: "long" | "short" | "multipleChoice",
    prompt?: string,
    expectedElements?: string,
    points?: number,
    rubric?: string,
    id?: string,
}

export type Test = {
    _id?: string,
    teacherId?: string,
    title?: string,
    subject?: string,
    gradeLevel?: "VG1" | "VG2" | "VG3",
    durationMinutes?: number,
    instructions?: string,
    status?: string,
    tasks: Section[],
    updatedAt?: string,
    createdAt?: string,
}

export type Status = "draft" | "published" | "archived";

export type QuestionType = "short" | "long" | "multipleChoice";

export type Question = {
    _id?: string;
    clientId: string;
    type: QuestionType;
    prompt: string;
    points: number;
    expectedElements?: string;
    rubric?: string;
    choices?: string[];
    correctChoiceIndex?: number;
};

export type Section = {
    _id?: string;
    clientId: string;
    title?: string;
    paragraphs: { clientId: string; text: string }[];
    questions: Question[];
};

export type TestDto = Test;
