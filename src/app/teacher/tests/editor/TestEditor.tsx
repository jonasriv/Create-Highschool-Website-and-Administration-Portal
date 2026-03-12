"use client";

import { useEffect, useState } from "react";
import { useTeacherStore } from "../../store";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { Test, Question, QuestionType, Section, Status } from "../types";
import type { TestDto } from "../dtoTypes";
import { editorToApiPayload, uid } from "./editorModel";

type Props = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  initialTest: Test;
  onSaved: (dto: TestDto) => void;
};

export default function TestEditor({ user, initialTest, onSaved }: Props) {
  const dark = useTeacherStore((s) => s.dark);

  // openSections lagrer sectionKey, ikke clientId
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [editingTest, setEditingTest] = useState<Test>(initialTest);

  // når bytter prøve (ny/edit/annen id), resett editor-state
  useEffect(() => {
    setEditingTest(initialTest);
    setOpenSections([]);
  }, [initialTest]);

  // ---------- helpers ----------
  const sectionKey = (s: Section) => s._id ?? s.clientId;
  const questionKey = (q: Question) => q._id ?? q.clientId;

  function toggleSection(sKey: string) {
    setOpenSections((prev) =>
      prev.includes(sKey) ? prev.filter((x) => x !== sKey) : [...prev, sKey]
    );
  }

  function addSection() {
    const newSection: Section = {
      clientId: uid(),
      title: "",
      paragraphs: [{ clientId: uid(), text: "" }],
      questions: [{ clientId: uid(), type: "long", prompt: "", points: 1 }],
    };

    setEditingTest((t) => ({ ...t, tasks: [...t.tasks, newSection] }));
    toggleSection(sectionKey(newSection));
  }

  function deleteSection(sKey: string) {
    setEditingTest((t) => ({ ...t, tasks: t.tasks.filter((s) => sectionKey(s) !== sKey) }));
    setOpenSections((prev) => prev.filter((x) => x !== sKey));
  }

  function updateSectionTitle(sKey: string, title: string) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) => (sectionKey(s) === sKey ? { ...s, title } : s)),
    }));
  }

  function addParagraph(sKey: string) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey
          ? { ...s, paragraphs: [...s.paragraphs, { clientId: uid(), text: "" }] }
          : s
      ),
    }));
  }

  function updateParagraph(sKey: string, pId: string, text: string) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey
          ? {
              ...s,
              paragraphs: s.paragraphs.map((p) =>
                p.clientId === pId ? { ...p, text } : p
              ),
            }
          : s
      ),
    }));
  }

  function deleteParagraph(sKey: string, pId: string) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey
          ? { ...s, paragraphs: s.paragraphs.filter((p) => p.clientId !== pId) }
          : s
      ),
    }));
  }

  function addQuestion(sKey: string) {
    const q: Question = { clientId: uid(), type: "long", prompt: "", points: 1 };
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey ? { ...s, questions: [...s.questions, q] } : s
      ),
    }));
  }

  function updateQuestionField(sKey: string, qKey: string, patch: Partial<Question>) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey
          ? {
              ...s,
              questions: s.questions.map((q) =>
                questionKey(q) === qKey ? { ...q, ...patch } : q
              ),
            }
          : s
      ),
    }));
  }

  function deleteQuestion(sKey: string, qKey: string) {
    setEditingTest((t) => ({
      ...t,
      tasks: t.tasks.map((s) =>
        sectionKey(s) === sKey
          ? { ...s, questions: s.questions.filter((q) => questionKey(q) !== qKey) }
          : s
      ),
    }));
  }

  async function saveTest() {
    if (!user?.id) return;
    if (!editingTest.title?.trim() || !editingTest.subject?.trim()) return;

    const isEdit = Boolean(editingTest._id);
    const url = isEdit ? `/api/tests/${editingTest._id}` : `/api/tests`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: user.id,
          ...editorToApiPayload(editingTest),
        }),
      });

      if (!res.ok) throw new Error("Kunne ikke lagre prøve");
      const saved = (await res.json()) as TestDto;

      onSaved(saved);

      // hvis den var ny og fikk _id, behold _id lokalt
      if (!isEdit && saved._id) {
        setEditingTest((t) => ({ ...t, _id: saved._id }));
      }
    } catch (err) {
      console.log(err);
      alert("Kunne ikke lagre prøve (se console).");
    }
  }

  // ---------- UI ----------
  const boxBg = dark ? "bg-slate-400 text-slate-800" : "bg-slate-500 text-slate-200";
  const inputBg = "bg-slate-200 text-slate-800";

  return (
    <div className="overflow-y-scroll">
      <form className="flex flex-col mb-2 overflow-y-scroll">
        <h3 className={`w-full uppercase text-lg py-2 flex ${dark ? "text-slate-400" : "text-slate-800"} flex-row items-center justify-start`}>
          Rediger &apos;{editingTest.title || "ny prøve"}&apos;
        </h3>

        {/* Meta */}
        <div className={`rounded-sm ${dark ? "bg-slate-500" : "bg-slate-400"}  px-2 pt-4 pb-6`}>
          <p className="w-full mb-4 font-mina font-bold text-left text-slate-800 uppercase py-2">
            Rediger prøve
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className={`${boxBg} flex flex-col shadow-md p-2 rounded-sm`}>
              <p className="uppercase text-sm">Tittel</p>
              <input
                value={editingTest.title ?? ""}
                placeholder="Tittel"
                type="text"
                onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })}
                className={`h-8 p-1 mt-1 rounded-sm ${inputBg}`}
              />
            </div>

            <div className={`${boxBg} flex flex-col shadow-md p-2 rounded-sm`}>
              <p className="uppercase text-sm">Fag</p>
              <input
                value={editingTest.subject ?? ""}
                placeholder="Fag"
                type="text"
                onChange={(e) => setEditingTest({ ...editingTest, subject: e.target.value })}
                className={`h-8 p-1 mt-1 rounded-sm ${inputBg}`}
              />
            </div>

            <div className={`${boxBg} flex shadow-md flex-col p-2 rounded-sm`}>
              <p className="uppercase text-sm">Trinn</p>
              <select
                value={editingTest.gradeLevel ?? "VG1"}
                onChange={(e) =>
                  setEditingTest({ ...editingTest, gradeLevel: e.target.value as Test["gradeLevel"] })
                }
                className={`h-8 p-1 mt-1 rounded-sm ${inputBg}`}
              >
                <option value="VG1">VG1</option>
                <option value="VG2">VG2</option>
                <option value="VG3">VG3</option>
              </select>
            </div>

            <div className={`${boxBg} flex shadow-md flex-col p-2 rounded-sm`}>
              <p className="uppercase text-sm">Status</p>
              <select
                value={(editingTest.status as Status) ?? "draft"}
                onChange={(e) =>
                  setEditingTest({ ...editingTest, status: e.target.value as Status })
                }
                className={`h-8 text-sm uppercase p-1 mt-1 shadow-md rounded-sm ${
                  (editingTest.status ?? "draft") === "draft"
                    ? "bg-amber-300 text-slate-800"
                    : editingTest.status === "published"
                    ? "bg-green-500 text-slate-900"
                    : "bg-amber-950 text-slate-200"
                }`}
              >
                <option value="draft">Utkast</option>
                <option value="published">Publisert</option>
                <option value="archived">Arkivert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className={`rounded-sm ${dark ? "bg-slate-500" : "bg-slate-400"}  px-2 pt-4 pb-6 mt-4`}>
          <p className="w-full font-mina font-bold text-left text-slate-800 uppercase py-2">
            Oppgaver
          </p>

          {(editingTest.tasks?.length ?? 0) === 0 ? (
            <p className="w-ful text-left my-4 text-sm opacity-80 text-slate-700">Ingen oppgaver</p>
          ) : (
            <div className="mt-2 flex flex-col gap-4 text-slate-800">
              {editingTest.tasks.map((s, sIdx) => {
                const sKey = sectionKey(s);
                const isOpen = openSections.includes(sKey);

                return (
                  <div
                    key={sKey}
                    className="odd:bg-amber-800 even:bg-slate-600 border border-slate-600 rounded-sm p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <p className="font-mina uppercase text-sm text-white font-bold">
                        Oppgave {sIdx + 1}
                      </p>

                      <p className="w-24 min-w-24 uppercase text-xs">
                        <i>{s.title}</i>
                      </p>

                      <button
                        type="button"
                        onClick={() => deleteSection(sKey)}
                        className="text-xs uppercase font-bold flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Slett
                      </button>

                      <div
                        className="hover:bg-white/40 cursor-pointer rounded-sm bg-slate-300 flex flex-row items-center justify-end"
                        onClick={() => toggleSection(sKey)}
                      >
                        {isOpen ? (
                          <span className="w-16 px-2 py-2 flex flex-row items-center justify-between uppercase text-xs">
                            Skjul <ChevronUp size={16} />
                          </span>
                        ) : (
                          <span className="w-16 px-2 py-2 flex flex-row items-center justify-between uppercase text-xs">
                            Vis <ChevronDown size={16} />
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={[
                        "block overflow-hidden transition-[max-height] duration-500",
                        isOpen ? "max-h-[3000px]" : "max-h-0",
                      ].join(" ")}
                    >
                      <div className="mt-2">
                        <input
                          value={s.title ?? ""}
                          placeholder="Tittel"
                          onChange={(e) => updateSectionTitle(sKey, e.target.value)}
                          className="w-full h-8 p-1 rounded-sm bg-white/70 text-slate-900"
                        />
                      </div>

                      <br />
                      <hr />

                      {/* Paragraphs */}
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-white font-mina uppercase">
                          Tekst / info
                        </p>

                        <div className="mt-2 flex flex-col gap-2">
                          {s.paragraphs.map((p, pIdx) => (
                            <div key={p.clientId} className="flex gap-2">
                              <textarea
                                value={p.text}
                                placeholder={`Avsnitt ${pIdx + 1}`}
                                onChange={(e) => updateParagraph(sKey, p.clientId, e.target.value)}
                                className="w-full min-h-[70px] p-2 rounded-sm bg-white/70 text-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => deleteParagraph(sKey, p.clientId)}
                                className="px-2 rounded-sm border border-slate-400 text-slate-700 hover:bg-black/5"
                                title="Slett avsnitt"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addParagraph(sKey)}
                            className="text-xs uppercase font-bold flex items-center gap-1"
                          >
                            <Plus size={14} /> Legg til avsnitt
                          </button>
                        </div>
                      </div>

                      <br />
                      <hr />

                      {/* Questions */}
                      <div className="mt-4">
                        <p className="text-xs text-white font-mina font-semibold uppercase">
                          Delspørsmål
                        </p>

                        <div className="mt-2 flex flex-col gap-2">
                          {s.questions.map((q, qIdx) => {
                            const qKey = questionKey(q);
                            return (
                              <div key={qKey} className="rounded-sm border border-slate-400 p-2 bg-white/50">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-black font-mina uppercase">
                                    Spørsmål {qIdx + 1}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => deleteQuestion(sKey, qKey)}
                                    className="text-xs uppercase font-bold flex items-center gap-1 opacity-80 hover:opacity-100"
                                  >
                                    <Trash2 size={14} /> Slett
                                  </button>
                                </div>

                                <div className="mt-2 flex flex-row justify-between items-center gap-2">
                                  Type:
                                  <select
                                    value={q.type}
                                    onChange={(e) =>
                                      updateQuestionField(sKey, qKey, { type: e.target.value as QuestionType })
                                    }
                                    className="h-7 p-1 rounded-sm bg-white/70 text-slate-900"
                                  >
                                    <option value="short">Kort</option>
                                    <option value="long">Lang</option>
                                    <option value="multipleChoice">Flervalg</option>
                                  </select>

                                  Poeng:
                                  <input
                                    type="number"
                                    value={q.points}
                                    onChange={(e) => updateQuestionField(sKey, qKey, { points: Number(e.target.value || 0) })}
                                    className="h-8 p-1 w-10 rounded-sm bg-white/70 text-slate-900"
                                  />

                                  Forventet innhold:
                                  <input
                                    value={q.expectedElements ?? ""}
                                    onChange={(e) => updateQuestionField(sKey, qKey, { expectedElements: e.target.value })}
                                    className="h-8 p-1 rounded-sm bg-white/70 text-slate-900"
                                  />
                                </div>

                                <textarea
                                  value={q.prompt}
                                  onChange={(e) => updateQuestionField(sKey, qKey, { prompt: e.target.value })}
                                  placeholder="Skriv delspørsmålet her…"
                                  className="w-full mt-2 min-h-[70px] p-2 rounded-sm bg-white/70 text-slate-900"
                                />

                                <textarea
                                  value={q.rubric ?? ""}
                                  onChange={(e) => updateQuestionField(sKey, qKey, { rubric: e.target.value })}
                                  placeholder="Vurderingskriterier e.l."
                                  className="w-full mt-2 min-h-[60px] p-2 rounded-sm bg-white/70 text-slate-900"
                                />
                              </div>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => addQuestion(sKey)}
                            className="text-xs uppercase font-bold flex items-center gap-1"
                          >
                            <Plus size={14} /> Legg til spørsmål
                          </button>
                        </div>
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={addSection}
            className="p-2 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase mt-3 flex flex-row justify-between items-center gap-2"
          >
            <span>Legg til oppgave</span> <Plus size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={saveTest}
          className="w-full bg-blue-500 p-4 uppercase font-mina font-bold text-slate-200 hover:bg-blue-600 cursor-pointer my-2 rounded-sm"
        >
          LAGRE PRØVE
        </button>
      </form>
    </div>
  );
}