"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";

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

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        acc += decoder.decode(value, { stream: true });

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
    <div className="w-full bg-transparent text-white tracking-wide h-[800px] max-h-[800px] overflow-scroll">
    <div className="rounded-md bg-transparent shadow-sm overflow-hidden">
        <div className="p-2 border-b mb-2">
        <div className="font-semibold font-mina">Create læringsassistent</div>
        <div className="text-sm opacity-70 font-mina p-2">
            Jeg gir ikke fasit – men hjelper deg gjerne med spørsmål, hint og tilbakemelding.
        </div>
        </div>

        <div className="p-4 space-y-3 max-h-[65vh] overflow-auto text-black ">
        {messages.map((m, idx) => (
            <div
            key={idx}
            className={`w-full flex  ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
            <div
                className={`whitespace-pre-wrap rounded-lg px-4 py-2 text-md font-exo2 tracking-wider font-sans ${
                m.role === "user"
                    ? "bg-black border-1 border-white text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
            >
                {m.content}
            </div>
            </div>
        ))}
        
        {isSending && (
            <div className="bg-pink-400">  <Spinner/>           
            </div>
        )}
                    

        <div ref={endRef} />
        </div>

        <div className="p-3 border-t flex gap-2 text-black">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv hva du jobber med…"
            className="flex-1 resize-none rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            rows={2}
            onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
            }
            }}
            disabled={isSending}
        />
        <div className="flex flex-col gap-2">
            <button
            onClick={send}
            disabled={isSending || !input.trim()}
            className="rounded-xl px-4 py-2 text-sm bg-primary text-primary-foreground disabled:opacity-50"
            >
            Send
            </button>
            <button
            onClick={stop}
            disabled={!isSending}
            className="rounded-xl px-4 py-2 text-sm border disabled:opacity-50"
            >
            Stopp
            </button>
        </div>
        </div>
    </div>

    <div className="text-xs opacity-60 mt-3">
        Tips: Lim inn oppgaveteksten + ditt eget forsøk. Jeg kan hjelpe med struktur, hint og sjekkpunkter.
    </div>
    </div>
);
}
