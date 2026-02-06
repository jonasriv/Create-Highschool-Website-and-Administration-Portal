/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Pencil, RefreshCw, PlusCircle, MinusCircle } from "lucide-react";
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
    const [showingAllNotes, setShowingAllNotes] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    
    const filteredNotes = useMemo(() => {
        const q = searchString.trim().toLowerCase();
        if (!q) return notes;
        return notes.filter((n) => (n.title ?? "").toLowerCase().includes(q))
    }, [notes, searchString]);

    const canEdit = !!active && typeof active.title === "string" && typeof active.content === "string";

    const left = useMemo(() => {
        return (
        <div className="w-full overflow-hidden text-white border-b border-redish pb-3">
            <div className="py-3 px-1 flex items-center justify-between gap-2 border-redish ">
                
                <input 
                    className="p-2 w-[90%] rounded-md h-7 text-black text-sm shadow-md"
                    type="text"
                    placeholder="Søk..."
                    value={searchString}
                    onChange={(e) => {setSearchString(e.target.value)}}
                />
                <button
                    onClick={createNote}
                    className="p-2 rounded-full bg-moreredish text-primary-foreground text-sm"
                >
                    <Pencil size="16" color="white"/>
                </button>
            </div>

            <div className={`transition-all duration-400 ${showingAllNotes ? "opacity-100 h-48 overflow-scroll border-white mt-4 bg-white/90 text-black rounded-sm border-black/20 border" : "h-0 opacity-0 forbidden disabled"}`}>
                {notes.length === 0 && !isLoading && (
                    <div className="p-3 text-sm opacity-70">Ingen notater ennå. Trykk “Nytt”.</div>
                )}
                
                {filteredNotes.map((n) => (
                    <button
                        key={n._id}
                        onClick={() => setActiveId(n._id)}
                        className={`w-full text-left flex flex-row h-8 justify-between items-center px-2 border-b border-white hover:bg-black/20 text-black text-sm font-notable font-normal ${
                            n._id === activeId ? "text-moreredish" : ""
                        } odd:bg-black/5`}
                    >
                        <div className="flex flex-row justify-start items-end gap-2">
                            <div className={`truncate ${n._id === activeId ? "font-black" : "font-thin"}`} >{n.title || "Uten tittel"}</div>
                            <div className="text-xs opacity-70 ">{fmt(n.updatedAt).split(",")[0]} <span className="text-[10px]">{fmt(n.updatedAt).split(",")[1]}</span></div>
                        </div>

                        <div className="mt-1 mb-2 flex gap-2 ">
                            {/* <span className="text-[11px] opacity-50">ID: {n._id.slice(-6)}</span> */}
                            <span className="flex-1" />
                            <span
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (confirm("Slette notatet?")) deleteNote(n._id);
                            }}
                            className="text-xs cursor-pointer bg-moreredish hover:bg-redish rounded-full p-1 mt-1"
                            >
                            <X size="12" color="white"/>
                            </span>
                        </div>
                    </button>
                ))}
                
            </div>

        </div>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredNotes, isLoading, activeId, showingAllNotes]);

    return (
    <div className="elev_component_div">
        <div className="rounded-md bg-transparent overflow-hidden">
            <div className="p-2 border-b border-redish mb-2">
                <div className="elev_component_header">Mine notater</div>
                    <div className="text-sm opacity-90 font-mina font-italic">
                        Skriv og søk i notater
                    </div>
            </div>
        </div>
        {left}
            <div className="w-full text-center flex flex-row justify-between items-center pt-2 text-redish px-2">
                {showingAllNotes ? (
                    <div onClick={() => setShowingAllNotes(false)}  className="px-2 py-1 text-sm shadow-md bg-white/90 flex flex-row justify-center items-center cursor-pointer hover:bg-black/20 rounded-full">
                        <MinusCircle size={16}/>  &nbsp;Skjul alle notater
                    </div>
                ) : 
                (
                    <div onClick={() => setShowingAllNotes(true)} className="px-2 shadow-md text-sm py-1 bg-white/90 flex flex-row justify-center items-center cursor-pointer hover:bg-black/20 rounded-full">
                    <PlusCircle size={16}/> &nbsp;  Vis alle notater 
                    </div>
                )
                }
                
                <div onClick={loadList} className="p-1  shadow-md bg-white/90 flex flex-row justify-center items-center cursor-pointer hover:bg-black/20 rounded-full">
                    <RefreshCw size={16}/>
                </div>
                
            </div>
            <div className="rounded-md overflow-hidden mt-3">
                
                <div className="p-2 flex items-center gap-3">
                    
                    <div className="font-normal text-md">Rediger &quot;{active?.title ?? "notat"}&quot;</div>
                    <div className="text-xs opacity-70">
                        {isSaving ? "Lagrer…" : active ? `${fmt(active.updatedAt)}` : "Velg et notat"}
                    </div>
                    <div className="flex-1" />

                    </div>

                    {error && <div className="p-2 text-sm text-destructive border-redish border-b">{error}</div>}

                    {!canEdit ? (
                        <div className="p-4 text-sm opacity-70">
                            Velg et notat over, eller trykk “Nytt”.
                        </div>
                    ) : (
                        <div className="p-2 space-y-3 text-black">
                            <input
                                value={active.title ?? ""}
                                onChange={(e) => {
                                    
                                    if (!active) return;
                                    const next = { ...active, title: e.target.value };
                                    setActive(next);
                                    scheduleSave(next);
                                }}
                                className="w-full border rounded-xl p-3 text-sm"
                                placeholder="Tittel…"
                                maxLength={120}
                            />

                            <textarea
                                value={active?.content ?? ""}
                                onChange={(e) => {
                                    if (!active) return ;
                                    const next = { ...active, content: e.target.value };
                                    setActive(next);
                                    scheduleSave(next);
                                }}
                                className="w-full h-28 min-h-28 border rounded-xl p-3 text-sm"
                                placeholder="Skriv notater her…"
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}
