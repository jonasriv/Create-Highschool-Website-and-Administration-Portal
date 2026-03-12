"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Send, Ban, ChevronRight, HeartHandshake, X, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useElevStore } from "../store";
import { TbWriting } from "react-icons/tb";
import { HiSpeakerphone } from "react-icons/hi";
import ReactMarkdown from "react-markdown";

const STORAGE_KEY = "create_chatbot_conversations";


type SavedConversation = {
    id: string;
    date: string;
    botMode: string;
    messages: ChatMessage[];
}

type ChatMessage = {
role: "user" | "assistant";
content: string;
botModeSent?: string;
};

type Segment = 
    | {type: "text"; content: string }
    | {type: "elevtekst"; content: string }
    | {type: "tips"; content: string };

function loadConversations(): SavedConversation[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    } catch {
        return [];
    } 
}

function saveConversation(messages: ChatMessage[], botMode: string) {
    const conversations = loadConversations();
    const newEntry: SavedConversation = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString("nb.NO"),
        botMode, 
        messages
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...conversations].slice(0, 20)));
}

function parseMessage(content: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /ELEVTEKST_START:?\s*([\s\S]*?)(?:ELEVTEKST_FERDIG|$)|TIPS_START:?\s*([\s\S]*?)(?:TIPS_FERDIG|$)/g

  let lastIndex = 0;

  for (const match of content.matchAll(regex)) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
    segments.push({ type: "elevtekst", content: match[1].trim() });
    } else {
    segments.push({ type: "tips", content: match[2].trim() });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  return segments;
}

const declaration = {
    task_bot: "Hei! Jeg er læringsassistenten din. Fortell hva du jobber med, så stiller jeg spørsmål og hjelper deg videre (uten å gi fasit).",
    text_bot: "Hei! Jeg gir tilbakemelding på tekster du har skrevet – tips til forbedring og videre arbeid. ",
    debate_bot: "Hei! Jeg er alltid uenig og utfordrer deg på påstandene og argumentene dine. ",
}

export default function ChatBot() {

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const triggerLookup = useElevStore((s) => s.actions.triggerLookup);
    const lastLookupTermRef = useRef<string | null>(null);
    const [lookupTerms, setLookupTerms] = useState<string[]>([]);
    const [botMode, setBotMode] = useState("task_bot");
    const closePanel = useElevStore((s) => s.actions.closePanel);
    const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
    const [showOldConversations, setShowOldConversations] = useState(false);
    const dark = useElevStore((s) => s.dark);

    // Henter tidl. samtaler fra localstorage
    useEffect(() => {
        setSavedConversations(loadConversations);
    }, []);

    const currentConversationId = useRef<string>(crypto.randomUUID());

    // AutoLAgring 
    useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || last.content === "") return;

    const conversations = loadConversations();
    const existing = conversations.findIndex(c => c.id === currentConversationId.current);

    const updated: SavedConversation = {
        id: currentConversationId.current,
        date: new Date().toLocaleDateString("nb-NO"),
        botMode,
        messages,
    };

    if (existing !== -1) {
        conversations[existing] = updated;
    } else {
        conversations.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, 20)));
    setSavedConversations(conversations.slice(0, 20));
    }, [messages]);

    // Reset medlagring til localstorage
    function reset() {
    setMessages([]);
    setLookupTerms([]);
    currentConversationId.current = crypto.randomUUID();
    }

    // gjenåpne gammel samtale: 
    function loadConversation(conv: SavedConversation) {
        currentConversationId.current = conv.id; // ← dette manglet
        setMessages(conv.messages);
        setBotMode(conv.botMode);
        setShowOldConversations(false);
    }

    function extractLookupTerm(text: string) {
        const m = text.match(/LOOKUP_TERM:\s*(.+)$/mi);
        return m?.[1]?.trim() ?? null;
    }

    function cleanMessage(text: string) { 
        return text.replace(/LOOKUP_TERM:\s*(.+)$/mi, "");
    }

    const modeColors: Record<string, string> = {
        task_bot: "bg-white",
        debate_bot: "bg-orange-300",
        text_bot: "bg-blue-200",
    };

    const didMount = useRef(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    async function send() {
        const text = input.trim();
        if (!text || isSending) return;

        setInput("");
        setIsSending(true);

        const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text, botModeSent: botMode }];
        setMessages(nextMessages);

        // Legg inn en tom assistant vi fyller mens vi streamer
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const sendingMode = botMode;
        try {
        const res = await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
            messages: nextMessages,
            botMode: sendingMode,
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
                copy[copy.length - 1] = { role: "assistant", content: acc, botModeSent: botMode };
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
                botModeSent: botMode,
            };
            return copy;
            }
            return [
            ...prev,
            { role: "assistant", content: "Oi! Noe gikk galt. Prøv igjen om litt.", botModeSent: botMode },
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
    <div className="elev_component_div overflow-hidden flex flex-col">
        
        
        {/* Hele chat-kortet */}
        <div className="flex flex-col flex-1 min-h-0 rounded-md overflow-hidden">
            
            {/* Header – fast høyde */}
            <div className="p-2 border-b border-redish mb-2 shrink-0">
                <div className="elev_component_header flex flex-row justify-between items-center">
                    Create GPT 
                    <div className="hidden md:block p-2 rounded-full bg-transparent hover:bg-white/20 cursor-pointer" onClick={() => closePanel("chat")}>
                        <X size="14"/>
                    </div>
                </div>
                
                <div className="text-xs md:text-sm font-mina font-italic">
                    
                    <div className="flex flex-row gap-3 justify-start my-2">
                        {([
                            { id: "task_bot",   label: "Hjelper", icon: <HeartHandshake size={12}/> },
                            { id: "debate_bot", label: "Debatt",  icon: <HiSpeakerphone size={12}/> },
                            { id: "text_bot",   label: "Tekst",   icon: <TbWriting size={12}/> },
                        ] as const).map(mode => (
                            <button
                                key={mode.id}
                                type="button"
                                onClick={() => {setLookupTerms([]); setBotMode(mode.id)}}
                                className={`flex flex-row gap-1 items-center px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                                    botMode === mode.id
                                        ? modeColors[mode.id] + " text-black font-semibold shadow"
                                        : "bg-black/20 text-white/80 hover:bg-white/30"
                                }`}
                            >
                                {mode.icon} {mode.label}
                            </button>
                        ))}
                    </div>

                    
                </div>
            </div>
            {/* Knapper for vis tidl chatter og Ny chat */}
            <div className="w-full flex flex-row items-center justify-between mb-2">
                <button 
                    className="flex px-1 text-xs uppercase font-semibold flex-row gap-2 items-center h-6 py-1 hover:bg-amber-600 rounded-md  cursor-pointer" type="button"
                    onClick={() => setShowOldConversations(!showOldConversations)}
                >
                    Mine samtaler
                    {showOldConversations ? <ChevronUp size="12"/> : <ChevronDown size="12"/>}
                </button>
                <button className="uppercase font-semibold text-xs hover:bg-amber-600 cursor-pointer p-1 rounded-sm flex flex-row justify-end gap-2 items-center"type= "button" onClick={() => reset()}><Plus size="12"/>Ny chat</button>
            </div>
            {/* Vise tidl chatter */}
            <div className={`${showOldConversations ? "inset-0 absolute " : "hidden" } flex flex-row justify-center items-start inset-0 absolute mt-[135px] w-full min-h-0 h-full! backdrop-blur-lg bg-black/100`}>
                <div className="w-full h-full overflow-auto rounded-md mx-2 mt-2">
                <table className="w-full text-xs text-black border-collapse">
                    <thead>
                    <tr className="bg-amber-600/50 text-white text-left sticky top-0">
                        <th className="px-2 py-2 font-semibold">Dato</th>
                        <th className="px-2 py-2 font-semibold">Modus</th>
                        <th className="px-2 py-2 font-semibold">Første melding</th>
                        <th className="px-2 py-2 font-semibold text-right">#</th>
                    </tr>
                    </thead>
                    <tbody>
                    {savedConversations.map((conv) => (
                        <tr
                        key={conv.id}
                        onClick={() => { loadConversation(conv); setShowOldConversations(false); }}
                        className="cursor-pointer hover:bg-amber-600 hover:text-white odd:bg-slate-200 even:bg-slate-300 transition-colors"
                        >
                        <td className="px-2 py-2 whitespace-nowrap">{conv.date}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{conv.botMode || "Hjelpemodus"}</td>
                        <td className="px-2 py-2 italic truncate max-w-[180px]">{conv.messages[0].content?.slice(0, 40)}</td>
                        <td className="px-2 py-2 text-right">{conv.messages.length}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            {/* Meldingsliste – tar all ledig plass, scroller selv */}
            <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto p-0 space-y-3 text-xs font-normal">
                <div className="w-[90%] flex text-left justify-start mr-auto">
                    <div className={`whitespace-pre-wrap rounded-md px-2 py-2 text-[15px] tracking-normal font-sans ${dark ? "shadow-[0_0_3px_0px_rgb(255,255,255,0.8)]" : "shadow-[0_0_3px_0px_rgb(0,0,0,0.8)]"} mt-2 ml-1 bg-slate-900/80 text-slate-200`}>
                        <div className="w-full flex flex-row justify-end items-start">
                            <HeartHandshake size="16" color="yellow"/>
                        </div>
                        <div className="leading-tight">
                            <ReactMarkdown>
                                {declaration[botMode as keyof typeof declaration] ?? declaration["task_bot"]}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
                {messages.map((m, idx) => (
                    <div key={idx} className={`w-[90%] flex ${m.role === "user" ? "justify-end ml-auto text-right" : "text-left justify-start mr-auto"}`}>
                        <div className={` whitespace-pre-wrap rounded-md text-black ${m.role === "user" ? "px-2 mr-1": "px-2 ml-1 "} ${dark ? "shadow-[0_0_3px_0px_rgb(255,255,255,0.8)]" : "shadow-[0_0_3px_0px_rgb(0,0,0,0.8)]"} py-2 text-[15px] tracking-normal font-sans ${
                            m.role === "user" ? "bg-amber-700 text-white" : cleanMessage.length < 1 ? "bg-transparent!" : "bg-slate-900/80 text-slate-200"
                        }`}>
                            <div className="w-full flex flex-row justify-end items-start ">
                                {m.role === "assistant" && m.botModeSent === "text_bot" && <TbWriting size="16" color="lightblue"/>}
                                {m.role === "assistant" && m.botModeSent === "task_bot" && <HeartHandshake size="16" color="yellow"/>}
                                {m.role === "assistant" && m.botModeSent === "debate_bot" && <HiSpeakerphone size="16" color="orange"/>}
                            </div>
                                {cleanMessage(m.content).trim().length > 0
                                ? parseMessage(cleanMessage(m.content)).map((seg, i) => {
                                    if (seg.type === "elevtekst")
                                        return <div key={i} className="elevtekst rounded-md bg-slate-700 text-white mt-1 px-1 [&_p]:bg-slate-700 py-2 italic"><ReactMarkdown>{seg.content.replace('"', '')}</ReactMarkdown></div>;
                                    if (seg.type === "tips")
                                        return <div key={i} className="tips flex flex-row leading-normal items-start mb-2 mt-2"><span className="mr-2">🟠</span><ReactMarkdown>{seg.content}</ReactMarkdown></div>;
                                    return <div key={i} className="leading-tight"><ReactMarkdown key={i}>{seg.content}</ReactMarkdown></div>;
                                    })
                                : <Spinner />}                        
                            </div>
                    </div>
                ))}

                {lookupTerms.length > 0 && (
                    <div className="w-full flex flex-col gap-1 justify-start items-start pb-2">
                        <p className="uppercase text-xs">Undersøk:</p>
                        <div className="flex flex-row gap-1 flex-wrap">
                            {lookupTerms.map(term =>
                                <span key={term} className="text-[10px] py-1 animate-bounce-low px-2 bg-gradient-to-r from-redish to-moreredish text-white rounded-md flex flex-row gap-0 items-center justify-center cursor-pointer hover:bg-moreredish font-semibold"
                                    onClick={() => triggerLookup(term)}>
                                    {term.slice(0, 18)}..
                                    <ChevronRight size="12"/>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Input – fast høyde */}
            <div className="pt-2 border-t border-redish flex flex-col gap-1 text-black shrink-0">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hva jobber du med?"
                        className="flex-1 shadow-md resize-none rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        rows={3}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
                        disabled={isSending}
                    />
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <button onClick={send} disabled={isSending || !input.trim()} className="shadow-md rounded-md flex items-center justify-center p-2 text-sm bg-white text-emerald-500 font-bold">
                            <Send size="16"/>
                        </button>
                        <button onClick={stop} disabled={!isSending} className="shadow-md rounded-md flex items-center justify-center p-2 text-sm border bg-white text-redish font-bold">
                            <Ban size="16"/>
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-white/40 px-1 pb-1">
                    Ikke gi chatboten personsensitiv informasjon som navn, tlf, epost etc.
                </p>
            </div>
        </div>
    </div>
);
}
