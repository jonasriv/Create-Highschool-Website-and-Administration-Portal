import mongoose, { Schema } from "mongoose";

export type TaskType = 
    | "short"
    | "long"
    | "multipleChoice"
    | "sourceAnalysis"
    | "practical";

export interface ITask {
    type: TaskType;
    prompt: string;
    expectedElements?: string;
    points: number;
    rubric?: string;
}

export interface ITest {
    teacherId: string;
    title: string;
    subject: string;
    gradeLevel: "VG1" | "VG2" | "VG3";
    durationMinutes: number;
    instructions?: string;
    status: "draft" | "published" | "archived";
    tasks: ITask[];
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        type: {
            type: String,
            enum: ["short", "long", "multipleChoice"],
            required: true,
        },
        prompt: { type: String, required: true },
        expectedElements: {type: String },
        points: { type: Number, required: true, default: 0 },
        rubric: { type: String },
    },
    { _id: false }
);

const TestSchema = new Schema<ITest>(
    {
        teacherId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        subject: { type: String, required: true },
        gradeLevel: { type: String, enum: ["VG1", "VG2", "VG3"], required: true },
        durationMinutes: { type: Number, required: false },
        instructions: { type: String },
        status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        },
        tasks: [TaskSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Test ||
mongoose.model<ITest>("Test", TestSchema);