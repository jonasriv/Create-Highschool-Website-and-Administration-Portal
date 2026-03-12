/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, RefreshCw } from "lucide-react";
import { useElevStore } from "../store";

type NoteListItem = {
    _id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type NoteFull = NoteListItem & { content: string };

function fmt(dt: string) {
    try {
        return new Date(dt).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" });
    } catch {
        return dt;
    }
}

export default function MyNotes() {
    const [notes, setNotes] = useState<NoteListItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [active, setActive] = useState<NoteFull | null>(null);
    const [searchString, setSearchString] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const closePanel = useElevStore((s) => s.actions.closePanel);
    const saveTimer = useRef<number | null>(null);
    const lastSaved = useRef<{ title: string; content: string } | null>(null);
    const notesOpen = useElevStore((s) => s.panelsOpen.notes);

    useEffect(() => {
        if (!notesOpen) return;
        loadList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notesOpen]);

    async function loadList() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/notes", { cache: "no-store" });
            if (!res.ok) throw new Error("Kunne ikke hente notater");
            const data = await res.json();
            setNotes(data.notes ?? []);
            if (!activeId && data.notes?.[0]?._id) setActiveId(data.notes[0]._id);
        } catch (e: any) {
            setError(e?.message ?? "Noe gikk galt");
        } finally {
            setIsLoading(false);
        }
    }

    async function loadNote(id: string) {
        setError(null);
        try {
            const res = await fetch(`/api/notes/${id}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Kunne ikke hente notatet");
            const data = await res.json();
            setActive(data.note);
            lastSaved.current = { title: data.note.title, content: data.note.content };
        } catch (e: any) {
            setError(e?.message ?? "Noe gikk galt");
        }
    }

    useEffect(() => {
        if (activeId) loadNote(activeId);
    }, [activeId]);

    async function createNote() {
        setError(null);
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Nytt notat" }),
            });
            if (!res.ok) throw new Error("Kunne ikke lage notat");
            const data = await res.json();
            const note: NoteFull = data.note;
            setNotes((prev) => [
                { _id: note._id, title: note.title, createdAt: note.createdAt, updatedAt: note.updatedAt },
                ...prev,
            ]);
            setActiveId(note._id);
        } catch (e: any) {
            setError(e?.message ?? "Noe gikk galt");
        }
    }

    async function deleteNote(id: string) {
        setError(null);
        try {
            const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Kunne ikke slette notat");
            setNotes((prev) => prev.filter((n) => n._id !== id));
            if (activeId === id) {
                setActive(null);
                setActiveId(null);
            }
        } catch (e: any) {
            setError(e?.message ?? "Noe gikk galt");
        }
    }

    function scheduleSave(next: NoteFull) {
        if (!activeId) return;
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(async () => {
            const prev = lastSaved.current;
            if (prev && prev.title === next.title && prev.content === next.content) return;
            setIsSaving(true);
            setError(null);
            try {
                const res = await fetch(`/api/notes/${activeId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: next.title, content: next.content }),
                });
                if (!res.ok) throw new Error("Kunne ikke lagre");
                const data = await res.json();
                const saved: NoteFull = data.note;
                lastSaved.current = { title: saved.title, content: saved.content };
                setNotes((prevList) => {
                    const updated = prevList.map((n) =>
                        n._id === saved._id ? { ...n, title: saved.title, updatedAt: saved.updatedAt } : n
                    );
                    updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    return updated;
                });
            } catch (e: any) {
                setError(e?.message ?? "Noe gikk galt ved lagring");
            } finally {
                setIsSaving(false);
            }
        }, 800);
    }

    const filteredNotes = useMemo(() => {
        const q = searchString.trim().toLowerCase();
        if (!q) return notes;
        return notes.filter((n) => (n.title ?? "").toLowerCase().includes(q));
    }, [notes, searchString]);

    const canEdit = !!active && typeof active.title === "string" && typeof active.content === "string";

    return (
        <div className="elev_component_div flex flex-col">

            {/* Header */}
            <div className="shrink-0 p-2 border-b border-redish">
                <div className="elev_component_header flex flex-row justify-between items-center">
                    Notater
                    <div className="flex flex-row items-center gap-1">
                        <button
                            onClick={loadList}
                            className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
                            title="Last inn på nytt"
                        >
                            <RefreshCw size={13} />
                        </button>
                        <button
                            onClick={createNote}
                            className="p-1.5 rounded-full bg-moreredish hover:bg-evenmoreredish text-white cursor-pointer"
                            title="Nytt notat"
                        >
                            <Plus size={13} />
                        </button>
                        <div
                            className="hidden md:block p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
                            onClick={() => closePanel("notes")}
                        >
                            <X size={13} />
                        </div>
                    </div>
                </div>
                <div className="hidden md:block text-sm opacity-90 font-mina">
                    Skriv og søk i notater
                </div>
            </div>

            {/* Søk + notat-liste */}
            <div className="shrink-0 py-2 border-b border-redish/30">
                <input
                    className="w-full px-2 py-1.5 rounded-md text-sm text-black bg-gray-100 border border-gray-300 mb-2"
                    type="text"
                    placeholder="Søk i notater..."
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <div className="max-h-44 overflow-y-auto flex flex-col gap-0.5">
                    {isLoading && <div className="text-xs opacity-50 px-1 py-2">Laster...</div>}
                    {!isLoading && filteredNotes.length === 0 && (
                        <div className="text-xs opacity-50 px-1 py-2">
                            Ingen notater. Trykk + for å lage ett.
                        </div>
                    )}
                    {filteredNotes.map((n) => (
                        <button
                            key={n._id}
                            onClick={() => setActiveId(n._id)}
                            className={`w-full text-left flex flex-row justify-between items-center px-2 py-1.5 rounded-md text-xs transition-colors ${
                                n._id === activeId
                                    ? "bg-moreredish text-white font-semibold"
                                    : "hover:bg-black/10 text-black"
                            }`}
                        >
                            <span className="truncate max-w-[70%] font-mina">
                                {n.title || "Uten tittel"}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] ${n._id === activeId ? "text-white/70" : "opacity-40"}`}>
                                    {fmt(n.updatedAt).split(",")[0]}
                                </span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("Slette notatet?")) deleteNote(n._id);
                                    }}
                                    className={`p-0.5 rounded-full cursor-pointer ${
                                        n._id === activeId ? "hover:bg-white/20" : "hover:bg-red-100"
                                    }`}
                                >
                                    <X size={11} className={n._id === activeId ? "text-white" : "text-gray-400"} />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0 flex flex-col py-2 gap-2">
                {error && <div className="text-xs text-red-500 px-1">{error}</div>}
                {!canEdit ? (
                    <div className="flex-1 flex items-center justify-center text-sm opacity-40">
                        Velg et notat, eller trykk + for å lage ett.
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 shrink-0 border-b border-gray-300 pb-1">
                            <input
                                value={active.title ?? ""}
                                onChange={(e) => {
                                    if (!active) return;
                                    const next = { ...active, title: e.target.value };
                                    setActive(next);
                                    scheduleSave(next);
                                }}
                                className="flex-1 bg-transparent px-1 py-0.5 text-sm font-semibold focus:outline-none"
                                placeholder="Tittel…"
                                maxLength={120}
                            />
                            <span className="text-[10px] opacity-40 shrink-0">
                                {isSaving ? "Lagrer…" : fmt(active.updatedAt).split(",")[0]}
                            </span>
                        </div>
                        <textarea
                            value={active?.content ?? ""}
                            onChange={(e) => {
                                if (!active) return;
                                const next = { ...active, content: e.target.value };
                                setActive(next);
                                scheduleSave(next);
                            }}
                            className="flex-1 min-h-0 w-full border border-gray-200 rounded-md p-2 text-sm resize-none focus:outline-none focus:border-redish bg-white/50"
                            placeholder="Skriv notatet her…"
                        />
                    </>
                )}
            </div>

        </div>
    );
}
