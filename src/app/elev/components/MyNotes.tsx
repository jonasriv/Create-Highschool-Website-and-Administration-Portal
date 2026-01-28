/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState<string | null>(null);

const saveTimer = useRef<number | null>(null);
const lastSaved = useRef<{ title: string; content: string } | null>(null);

async function loadList() {
    setIsLoading(true);
    setError(null);
    try {
    const res = await fetch("/api/notes", { cache: "no-store" });
    if (!res.ok) throw new Error("Kunne ikke hente notater");
    const data = await res.json();
    setNotes(data.notes ?? []);
    // auto-velg første
    if (!activeId && (data.notes?.[0]?._id)) setActiveId(data.notes[0]._id);
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
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

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

    // oppdater liste
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

    // debounce
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

        // oppdater liste (tittel + updatedAt + flytt til topp)
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

const canEdit = !!active;

const left = useMemo(() => {
    return (
    <div className="w-full md:w-80 border rounded-2xl overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between gap-2">
        <div className="font-semibold">Mine notater</div>
        <button
            onClick={createNote}
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm"
        >
            Nytt
        </button>
        </div>

        <div className="max-h-[70vh] overflow-auto">
        {notes.length === 0 && !isLoading && (
            <div className="p-3 text-sm opacity-70">Ingen notater ennå. Trykk “Nytt”.</div>
        )}

        {notes.map((n) => (
            <button
            key={n._id}
            onClick={() => setActiveId(n._id)}
            className={`w-full text-left p-3 border-b hover:bg-muted text-white ${
                n._id === activeId ? "bg-white/20" : ""
            }`}
            >
            <div className="font-medium text-sm truncate ">{n.title || "Uten tittel"}</div>
            <div className="text-xs opacity-70 ">Oppdatert: {fmt(n.updatedAt)}</div>

            <div className="mt-2 flex gap-2 ">
                <span className="text-[11px] opacity-50">ID: {n._id.slice(-6)}</span>
                <span className="flex-1" />
                <span
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("Slette notatet?")) deleteNote(n._id);
                }}
                className="text-xs text-destructive hover:underline cursor-pointer"
                >
                Slett
                </span>
            </div>
            </button>
        ))}
        </div>
    </div>
    );
}, [notes, isLoading, activeId, deleteNote]);

return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 font-bungee">
    {left}

    <div className="border rounded-2xl overflow-hidden">
        <div className="p-3 border-b flex items-center gap-3">
        <div className="font-semibold">Rediger</div>
        <div className="text-xs opacity-70">
            {isSaving ? "Lagrer…" : active ? `Sist oppdatert: ${fmt(active.updatedAt)}` : "Velg et notat"}
        </div>
        <div className="flex-1" />
        <button
            onClick={loadList}
            className="px-3 py-1.5 rounded-xl border text-sm"
        >
            Oppdater liste
        </button>
        </div>

        {error && <div className="p-3 text-sm text-destructive border-b">{error}</div>}

        {!canEdit ? (
        <div className="p-4 text-sm opacity-70">
            Velg et notat over, eller trykk “Nytt”.
        </div>
        ) : (
        <div className="p-4 space-y-3 text-black">
            <input
            value={active.title}
            onChange={(e) => {
                const next = { ...active, title: e.target.value };
                setActive(next);
                scheduleSave(next);
            }}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="Tittel…"
            maxLength={120}
            />

            <textarea
            value={active.content}
            onChange={(e) => {
                const next = { ...active, content: e.target.value };
                setActive(next);
                scheduleSave(next);
            }}
            className="w-full min-h-[50vh] border rounded-xl p-3 text-sm"
            placeholder="Skriv notater her…"
            />

            <div className="text-xs opacity-70 text-white">
            Tips: skriv et eget forsøk her, og lim inn i chatbot for feedback.
            </div>
        </div>
        )}
    </div>
    </div>
);
}
