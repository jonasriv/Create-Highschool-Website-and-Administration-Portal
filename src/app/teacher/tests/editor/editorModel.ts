// src/app/teacher/tests/editorModel.ts
import type { Test, Section, Question, Status } from "../types";
import type { TestDto } from "../dtoTypes";  // API type

export function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function emptyTest(teacherId: string): Test {
  return {
    teacherId,
    title: "",
    subject: "",
    gradeLevel: "VG1",
    durationMinutes: 0,
    instructions: "",
    status: "draft",
    tasks: [],
  };
}

/**
 * Sørger for at alt har clientId slik UI-et kan oppdatere/slette stabilt.
 * - Section.clientId
 * - Paragraph.clientId
 * - Question.clientId
 */
export function dtoToEditor(dto: TestDto, teacherIdFallback: string): Test {
  return {
    _id: dto._id,
    teacherId: dto.teacherId ?? teacherIdFallback,
    title: dto.title ?? "",
    subject: dto.subject ?? "",
    gradeLevel: dto.gradeLevel ?? "VG1",
    durationMinutes: dto.durationMinutes ?? 0,
    instructions: dto.instructions ?? "",
    status: (dto.status as Status) ?? "draft",
    tasks: (dto.tasks ?? []).map((s) => ({
      _id: s._id,
      clientId: uid(),
      title: s.title ?? "",
      paragraphs: (s.paragraphs ?? []).map((text) => ({ clientId: uid(), text })),
      questions: (s.questions ?? []).map((q) => ({
        _id: q._id,
        clientId: uid(),
        type: q.type ?? "long",
        prompt: q.prompt ?? "",
        points: q.points ?? 1,
        expectedElements: q.expectedElements,
        rubric: q.rubric,
        choices: q.choices,
        correctChoiceIndex: q.correctChoiceIndex,
      })),
    })),
  };
}

/**
 * Payload til API. kan evt droppe teacherId her og hente fra session i backend.
 */
export function editorToApiPayload(test: Test) {
  return {
    title: test.title ?? "",
    subject: test.subject ?? "",
    gradeLevel: test.gradeLevel ?? "VG1",
    durationMinutes: test.durationMinutes ?? 0,
    instructions: test.instructions ?? "",
    status: (test.status ?? "draft") as Status,
    tasks: (test.tasks ?? []).map((s: Section) => ({
      title: s.title ?? "",
      paragraphs: (s.paragraphs ?? []).map((p) => p.text ?? ""),
      questions: (s.questions ?? []).map((q: Question) => ({
        type: q.type,
        prompt: q.prompt,
        points: q.points,
        expectedElements: q.expectedElements,
        rubric: q.rubric,
        choices: q.choices,
        correctChoiceIndex: q.correctChoiceIndex,
      })),
    })),
  };
}