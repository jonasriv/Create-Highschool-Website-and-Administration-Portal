// src/app/teacher/tests/monitor/TestMonitor.tsx
"use client";

import type { TestDto } from "../dtoTypes";
import { CalendarFold } from "lucide-react";

type Props = {
  test: TestDto;
};

function convertDate(dbDate?: string) {
  if (!dbDate) return "";
  return new Date(dbDate).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function TestMonitor({ test }: Props) {
  return (
    <div className="p-2">
      <div className="rounded-sm bg-white/60 p-3 border border-slate-300">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-mina font-bold uppercase text-slate-900">
              {test.title || "(uten tittel)"}
            </h2>
            <p className="text-sm text-slate-700">
              {test.subject} • {test.gradeLevel} • {test.status}
            </p>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2">
            <CalendarFold size={16} />
            <span title="Opprettet (oppdatert)">
              {convertDate(test.createdAt)} {test.updatedAt ? `(${convertDate(test.updatedAt)})` : ""}
            </span>
          </div>
        </div>

        {test.instructions ? (
          <div className="mt-3 text-sm text-slate-800 whitespace-pre-wrap">
            {test.instructions}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {(test.tasks ?? []).map((s, idx) => (
          <div key={s._id ?? `${idx}`} className="rounded-sm bg-white/50 border border-slate-300 p-3">
            <div className="flex items-center justify-between">
              <p className="font-mina font-bold uppercase text-slate-900">
                Oppgave {idx + 1}{s.title ? `: ${s.title}` : ""}
              </p>
              <p className="text-xs text-slate-600">
                {(s.questions?.length ?? 0)} spørsmål • {(s.paragraphs?.length ?? 0)} avsnitt
              </p>
            </div>

            {(s.paragraphs ?? []).length > 0 && (
              <div className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-2">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {(s.questions ?? []).length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {s.questions.map((q, qi) => (
                  <div key={q._id ?? `${qi}`} className="rounded-sm bg-white/60 border border-slate-200 p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase font-bold text-slate-700">
                        Spørsmål {qi + 1} • {q.type} • {q.points}p
                      </p>
                    </div>
                    <p className="text-sm text-slate-900 whitespace-pre-wrap mt-1">
                      {q.prompt || <span className="opacity-60">(tomt spørsmål)</span>}
                    </p>
                    {q.rubric ? (
                      <p className="text-xs text-slate-600 whitespace-pre-wrap mt-2">
                        <b>Rubric:</b> {q.rubric}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}