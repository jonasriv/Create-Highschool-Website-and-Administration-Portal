/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Send, Ban } from "lucide-react";
import { useTeacherStore } from "../store";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hei! Jeg er lærerassistenten din. Jeg er raff på språk og diverse annet, men aner ikke hva som har skjedd siden juni 2024. Hva jobber du med?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastLookupTermRef = useRef<string | null>(null);
  const dark = useTeacherStore((s) => s.dark);
  const panelsOpen = useTeacherStore((s) => s.panelsOpen);

  const didMount = useRef(false);

  function cleanMessage(text: string) {
    return text.replace(/LOOKUP_TERM:\s*(.+)$/mi, "");
  }

  // Autoscroll kun inni chat-lista (ikke hele vinduet)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return; // ikke autoscroll på første render
    }
    const el = listRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    // ÉN setMessages for å unngå ekstra rerenders/jank
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/teacherChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({ messages: nextMessages }),
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

        // Oppdater siste assistant-melding (stream)
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (!last || last.role !== "assistant") return prev;
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e: any) {
      console.log(e);
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];

        // Hvis vi allerede har lagt inn tom assistant, fyll den med feilmelding
        if (last?.role === "assistant" && last.content === "") {
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Oi! Noe gikk galt. Prøv igjen om litt.",
          };
          return copy;
        }

        // Ellers legg til ny assistant-feilmelding
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
    <div
      className={`${panelsOpen.chat ? "block" : "hidden"} p-2 w-[50%] max-w-[600px] h-[800px] max-h-[calc(100vh-100px)] ${
        dark
          ? "bg-slate-800 text-slate-200 border-[1px] border-slate-600"
          : "bg-slate-200 text-slate-800 border-[1px] border-slate-400"
      } rounded-md`}
    >
      {/* Viktig: flex-col og h-full så meldingslista kan scrolle inni komponenten */}
      <div className="rounded-md bg-transparent h-full flex flex-col">
        <div className="p-2 border-b border-redish mb-2">
          <div className="elev_component_header">Create GPT</div>
          <div className="hidden md:block text-sm opacity-90 font-mina font-italic">
            Lærerassistent
          </div>
        </div>

        {/* Meldingsliste: flex-1 + overflow-y-auto (ikke max-h) */}
        <div
          ref={listRef}
          className="p-0 space-y-3 flex-1 text-xs font-normal overflow-y-auto"
        >
          {messages.map((m, idx) => {
            return (
              <div
                key={idx}
                className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`shadow-md whitespace-pre-wrap rounded-md px-2 py-2 text-md font-exo2 tracking-wider font-sans ${
                    m.role === "user"
                      ? "bg-redish border-1  text-primary-foreground"
                      : "bg-slate-100 text-foreground"
                  }`}
                >
                  {cleanMessage(m.content).trim().length > 0 ? cleanMessage(m.content) : <Spinner />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="py-2 mt-2 border-t border-redish flex gap-2 text-black">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hva jobber du med?"
            className="w-9/11 flex-1 shadow-md resize-none rounded-md border p-3 text-xs outline-none focus:ring-2 focus:ring-primary/30"
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
              className="shadow-md rounded-md flex flex-row justify-center items-center p-2 text-sm bg-white text-emerald-500 font-bold opacity-100"
            >
              <Send size="16" />
            </button>
            <button
              onClick={stop}
              disabled={!isSending}
              className="shadow-md rounded-md flex flex-row justify-center items-center p-2 text-sm border opacity-100 bg-white text-redish font-bold"
            >
              <Ban size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
