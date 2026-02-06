"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Send, Ban, Search } from "lucide-react";
import { useElevStore } from "../store";

type ChatMessage = {
role: "user" | "assistant";
content: string;
};

export default function ChatBot() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
        role: "assistant",
        content:
            "Hei! Jeg er læringsassistenten din. Fortell hva du jobber med, så stiller jeg spørsmål og hjelper deg videre (uten å gi fasit).",
        },
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);
    const triggerLookup = useElevStore((s) => s.actions.triggerLookup);
    const lastLookupTermRef = useRef<string | null>(null);
    const [lookupTerms, setLookupTerms] = useState<string[]>([]);

    function extractLookupTerm(text: string) {
        const m = text.match(/LOOKUP_TERM:\s*(.+)$/mi);
        return m?.[1]?.trim() ?? null;
    }

    function cleanMessage(text: string) { 
        return text.replace(/LOOKUP_TERM:\s*(.+)$/mi, "");
    }

    useEffect(() => {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages, isSending]);

    async function send() {
        const text = input.trim();
        if (!text || isSending) return;

        setInput("");
        setIsSending(true);

        const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
        setMessages(nextMessages);

        // Legg inn en tom assistant vi fyller mens vi streamer
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        abortRef.current?.abort();
        abortRef.current = new AbortController();

        try {
        const res = await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
            messages: nextMessages,
            }),
        });

        if (!res.ok || !res.body) {
            throw new Error(`Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        lastLookupTermRef.current = null;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            acc += decoder.decode(value, { stream: true });
            
            // oppdater lookup-term
            const term = extractLookupTerm(acc);
            if (term && term !== lastLookupTermRef.current) {
                lastLookupTermRef.current = term;
                setLookupTerms([]);
                const lookups = term.split(",");
                setLookupTerms(lookups);
            }

            // Oppdater siste assistant-melding
            setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (!last || last.role !== "assistant") return prev;
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            console.log(e);
            setMessages((prev) => {
            const copy = [...prev];
            // Skriv feilen i siste assistant
            const last = copy[copy.length - 1];
            if (last?.role === "assistant" && last.content === "") {
            copy[copy.length - 1] = {
                role: "assistant",
                content: "Oi! Noe gikk galt. Prøv igjen om litt.",
            };
            return copy;
            }
            return [
            ...prev,
            { role: "assistant", content: "Oi! Noe gikk galt. Prøv igjen om litt." },
            ];
        });
        } finally {
        setIsSending(false);
        }
    }

    function stop() {
        abortRef.current?.abort();
        setIsSending(false);
    }

    return (
        <div className="elev_component_div overflow-hidden">
        <div className="rounded-md bg-transparent overflow-hidden">
            <div className="p-2 border-b border-redish mb-2">
                <div className="elev_component_header">Create GPT</div>
                <div className="text-sm opacity-90 font-mina font-italic">
                    Hjelp, hint og tilbakemeldinger.
                </div>
            </div>

            <div className="p-0 space-y-3 max-h-[65vh] text-xs font-normal overflow-scroll">
                {messages.map((m, idx) => {
                return (
                    <div
                    key={idx}
                    className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`shadow-md whitespace-pre-wrap rounded-lg px-2 py-2 text-md font-exo2 tracking-wider font-sans ${
                            m.role === "user"
                                ? "bg-redish border-1  text-primary-foreground"
                                : "bg-slate-300 text-foreground"
                            }`}
                        >
                        {cleanMessage(m.content).trim().length > 0 ? cleanMessage(m.content) : <Spinner/>}


                      </div>
                    </div>
                );
                })}
            <div ref={endRef} />
            {lookupTerms.length > 0 && (
                <div className="w-full h-8 flex flex-row gap-2 justify-start items-center">
                    Finn ut mer: {lookupTerms.map(term => 
                        <span 
                        key={term} 
                        className="py-1 animate-bounce-low px-2 bg-gradient-to-r from-redish to-moreredish text-white rounded-md flex flex-row gap-1 items-center justify-center cursor-pointer hover:bg-moreredish font-semibold"
                            onClick={() => triggerLookup(term)}
                        >
                            {term}
                            <div className=""><Search size="12"/></div>
                            {/* <ChevronRight size="12"/> */}
                        </span>
                    )}
                </div>
            )
            }
            </div>

            <div className="py-2 border-t border-redish flex gap-2 text-black">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hva jobber du med?"
                    className="w-9/11 flex-1 shadow-md resize-none rounded-xl border p-3 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    rows={2}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                    }
                    }}
                    disabled={isSending}
                />
                <div className="flex flex-col gap-2 w-2/11 items-center justify-center">
                    <button
                    onClick={send}
                    disabled={isSending || !input.trim()}
                    className="shadow-md rounded-lg flex flex-row justify-center items-center p-2 text-sm bg-white text-emerald-500 font-bold opacity-100"
                    >
                    <Send size="16" />
                    </button>
                    <button
                    onClick={stop}
                    disabled={!isSending}
                    className="shadow-md rounded-lg flex flex-row justify-center items-center p-2 text-sm border opacity-100 bg-white text-redish font-bold"
                    >
                    <Ban size="16"/>
                    </button>
                </div>
            </div>
        </div>

        <div className="text-xs shadow-md opacity-80 mt-3 px-2 text-moreredish bg-white rounded-md py-1">
            <b>NB</b>: Ikke gi chatboten personsensitiv informasjon som navn, tlf, epost etc. 
        </div>
        </div>
    );
}
