"use client";

import { useEffect, useState, useRef } from "react"
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useElevStore } from "../store";

type Suggestion = {
    // felles
    source?: "snl" | "ndla" | "news";
    title: string;
    permalink: string;
    snippet?: string;
    licence?: string;
        
    // SNL-spesifikt
    headword?: string;
    clarification?: string;
    rank?: string;
    taxonomy_id?: string;
    first_image_url?: string;
    first_image_licence?: string;
    article_url?: string;
    first_two_sentences?: string;

    // NYHETER-spesifikt
    provider?: string;
    publishedAt?: string;  // ISO string
    guardian_id?: string;
};


export default function SearchComponent() {
    const [searchString, setSearchString] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [source, setSource] = useState<"snl" | "ndla" | "rss" | "search">("snl");
    const lookupEvent = useElevStore((s) => s.lookupEvent);
    const clearLookup = useElevStore((s) => s.actions.clearLookup)
    const closePanel = useElevStore((s) => s.actions.closePanel);
    const [expandedBox, setExpandedBox] = useState<Suggestion | null>(null);
    const [content, setContent] = useState<{ xhtml_body?: string; authors?: string; content?: string; } | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function getDetails(articleUrl: string, provider: "snl" | "ndla") {
        if (provider === "snl") {
            const res = await fetch(`/api/snl/getDetails?url=${encodeURIComponent(articleUrl)}`);
            return res.json();
        } else if (provider === "ndla") {
            const res = await fetch(`/api/ndla/getDetails?url=${encodeURIComponent(articleUrl)}`);
            return res.json();
        }
    }

    function stripTags(html: string) {
        return String(html ?? "").replace(/<[^>]*>/g, "");
    }

    // useeffect setter alle linker fra snl etc til å bli target blank: 
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;
        const links = contentRef.current.querySelectorAll("a");
        links.forEach((link) => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        });
    }, [content]);

    // useffect for å hente details når expand.
    useEffect(() => {
        if (!expandedBox) return;
        setContent(null);

        if (source === "snl" && expandedBox.article_url) {
            getDetails(expandedBox.article_url, "snl").then(setContent);
        } else if (source === "ndla" && expandedBox.permalink) {
            getDetails(expandedBox.permalink, "ndla").then(setContent);
        } else if (source === "search" && expandedBox.guardian_id) {
            // Guardian: hent via offisiell API
            fetch(`/api/nyheter/guardianContent?id=${encodeURIComponent(expandedBox.guardian_id)}`)
                .then((r) => r.json())
                .then(setContent)
                .catch(() => setContent(null));
        } else if (source === "rss" && expandedBox.permalink) {
            // RSS-artikler: skrap med Readability
            fetch(`/api/nyheter/getContent?url=${encodeURIComponent(expandedBox.permalink)}`)
                .then((r) => r.json())
                .then(setContent)
                .catch(() => setContent(null));
        }
    }, [expandedBox]);

    // Debounce: hent forslag 300ms etter siste tastetrykk
    useEffect(() => {
        const q = searchString.trim();
        if (q.length < 3) {
            setSuggestions([]);
            setOpen(false);
            setActiveIndex(-1);
            return;
        }

        const t = window.setTimeout(async () => {
            try {
                setLoading(true);
                const endpoint = source === "ndla" ? "/api/ndla/suggest" 
                    : source === "snl" ? "/api/snl/suggest" 
                    : source === "search" ? "/api/nyheter/search" 
                    : "/api/nyheter/suggest";
                const res = await fetch(`${endpoint}?q=${encodeURIComponent(q)}`);
                const data = await res.json();
                setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
                setOpen(true);
                setActiveIndex(-1);
            } catch {
                setSuggestions([]);
                setOpen(false);
                setActiveIndex(-1);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => window.clearTimeout(t);
    }, [searchString, source]);

    useEffect(() => {
        if (!lookupEvent) {
            return;
        }
        setSearchString(lookupEvent.term.split(",")[0]);
        inputRef.current?.focus();

        const t = window.setTimeout(() => clearLookup(), 0)
        return () => window.clearTimeout(t);
    }, [lookupEvent?.id, clearLookup])

    useEffect(() => {
        setSuggestions([]);
        setActiveIndex(-1);
        setOpen(false); // evt true hvis du vil holde åpent
        }, [source]);

    return(
        <div className="elev_component_div flex flex-col">
            <div className="flex flex-col items-start justify-between gap-2 w-full shrink-0">
                <div className="rounded-md bg-transparent overflow-hidden w-full">
                    <div className="p-2 border-b border-redish w-full">
                        <div className="elev_component_header flex flex-row items-center justify-between">
                            Temasøk
                            <div className="w-full flex flex-row justify-end items-center h-8">
                                <div className="hidden md:block p-2 rounded-full bg-transparent hover:bg-white/20 cursor-pointer" onClick={() => closePanel("search")}><X size="14"/></div>
                            </div>
                        </div>
                            <div className="hidden md:block text-sm font-mina font-italic">
                                Tema, nøkkelord, personer, nyheter
                            </div>
                        </div>
                    </div>
                <div className="flex flex-row gap-1 items-center justify-between w-full ">
                    <input 
                        ref={inputRef}
                        className="px-2 py-3 bg-gray-100 border-[0.5px] border-gray-500 rounded-md h-8 tracking-wider text-black font-roboto text-md w-11/12 items-center"
                        type="text"
                        placeholder="Søk..."
                        value={searchString}
                        onChange={(e) => {setSearchString(e.target.value)}}
                        onFocus={() => {
                            if (suggestions.length > 0) setOpen(true);
                        }}
                        onBlur={() => {
                            window.setTimeout(() => setOpen(false), 120);
                        }}
                        onKeyDown={(e) => {
                            if (!open) return;
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setActiveIndex((i) => Math.max(i - 1, -1));
                            } else if (e.key === "Enter") {
                                if (activeIndex >= 0 && suggestions[activeIndex]) {
                                    e.preventDefault();
                                }
                            } else if (e.key === "Escape") {
                                setOpen(false);
                                setActiveIndex(-1);
                            }
                        }}
                    />
                                {/* status */}
                    <div className="text-xs font-sans opacity-80 h-12 min-h-12 flex flex-row justify-center items-center ">
                        {loading ? <Spinner/> : searchString.trim().length < 3 ? "" : ""}
                    </div>

                </div>                  
                <div className="flex gap-2 mb-2 ">
                    <button
                        type="button"
                        onClick={() => {setContent(null); setExpandedBox(null); setSource("snl")}}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-semibold rounded ${source === "snl" ? "bg-moreredish text-white" : "bg-gray-300 text-black"}`}
                    >
                        SNL
                    </button>
                    <button
                        type="button"
                        onClick={() => {setContent(null); setExpandedBox(null); setSource("ndla")}}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-semibold rounded ${source === "ndla" ? "bg-moreredish text-white" : "bg-gray-300 text-black"}`}
                    >
                    NDLA
                    </button>
                    <button
                        type="button"
                        onClick={() => {setContent(null); setExpandedBox(null); setSource("rss")}}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-semibold rounded ${source === "rss" ? "bg-moreredish text-white" : "bg-gray-300 text-black"}`}
                    >
                    Feed
                    </button>                    
                    <button
                        type="button"
                        onClick={() => {setContent(null); setExpandedBox(null); setSource("search")}}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-semibold rounded ${source === "search" ? "bg-moreredish text-white" : "bg-gray-300 text-black"}`}
                    >
                    Nyhetssøk
                    </button>                      
                </div>
            </div>
            {/* dropdown */}
            <h2 className="w-full text-left text-sm p-1 font-mina font-normal tracking-wider shrink-0">
                {suggestions.length > 0 ? "" : searchString.length < 3 ? "Skriv inn et søk..." : "Juster søket"}
                
            </h2>
            <div className="relative flex-1 min-h-0 flex flex-col p-0 rounded-md border-redish overflow-hidden">

                {/* MODAL FOR EXPANDED SUGGESTION */}
                {expandedBox && 
                    <div className="absolute flex flex-col justify-start items-start inset-0 z-10 backdrop-blur-xl bg-white text-black rounded-md p-4 overflow-auto">
                        <div className="flex justify-between w-full items-start mb-2">
                            <a
                                href={source === "snl" ? expandedBox.article_url || expandedBox.permalink : expandedBox.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-gray-400 hover:text-redish truncate max-w-[85%] mt-1"
                            >
                                {source === "snl" ? expandedBox.article_url || expandedBox.permalink : expandedBox.permalink}
                            </a>
                            <button type="button" className="p-1 rounded-full hover:bg-redish hover:text-white cursor-pointer shrink-0" onClick={() => {setExpandedBox(null); setContent(null);}}><X size="16"/></button>
                        </div>
                        <div className="">
                            {expandedBox.first_image_url && source !== "ndla" &&
                                    <Image
                                        alt={expandedBox.title}
                                        width={300}
                                        height={200}
                                        src={expandedBox.first_image_url}
                                        className="object-contain object-left rounded-sm"
                                        quality={50}
                                    />
                                }
                        </div>
                        <div className="mt-2 text-sm leading-relaxed w-full">
                            <b className="text-base">{expandedBox.title}</b>
                            {(source === "rss" || source === "search") ? (
                                <div className="mt-3 space-y-3">
                                    {expandedBox.publishedAt && (
                                        <p className="text-xs text-gray-500">{new Date(expandedBox.publishedAt).toLocaleString("nb-NO", { dateStyle: "medium", timeStyle: "short" })}</p>
                                    )}
                                    <Link target="_blank" href={expandedBox.permalink || ""} className="inline-flex items-center gap-1 bg-redish text-white text-xs px-3 py-1.5 rounded-md font-semibold">
                                        Les hos {expandedBox.provider ?? expandedBox.permalink.split("/")[2]} <ChevronRight size={12}/>
                                    </Link>
                                    {content?.content
                                        ? <div ref={contentRef}
                                            className="prose prose-sm max-w-none mt-4
                                                prose-headings:text-black prose-headings:font-bold
                                                prose-a:text-redish prose-a:no-underline hover:prose-a:underline
                                                prose-p:text-gray-700 prose-p:leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: content.content }}
                                          />
                                        : <Spinner />
                                    }
                                </div>
                            ) : (
                                <>
                                    {content?.xhtml_body || content?.content
                                        ?
                                            <div ref={contentRef}
                                                className="prose prose-sm max-w-none mt-4
                                                    prose-headings:text-black prose-headings:font-bold
                                                    prose-a:text-redish prose-a:no-underline hover:prose-a:underline
                                                    prose-p:text-gray-700 prose-p:leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: source === "snl"
                                                        ? content.xhtml_body || ""
                                                        : content?.content || ""
                                                }}
                                            />
                                        : <Spinner />
                                    }
                                </>
                            )}
                        </div>


                    </div>
                }

                {/* liste over treff */}
                <ul className="grid grid-cols-1 gap-2 overflow-auto text-sm text-black">
                    {suggestions.map((s, idx) => {
                        const active = idx === activeIndex;
                        return (
                            <li 
                                key={`#{s.title}-${idx}`}
                                className={`rounded-md bg-white shadow-md gap-4 flex flex-row justify-between items-start px-3 py-2 h-auto cursor-pointer ${active ? "" : ""} odd:bg-white even:bg-white/90`}
                            >
                                <div className="w-8/12 max-w-10/12" onClick={() => setExpandedBox(s)}>
                                    <div className="capitalize text.md font-bold mb-2">
                                        {s.title}
                                        {(source === "rss" || source === "search")
                                            ? <span className="uppercase text-xs"> ({s.provider})</span>
                                            : <span className="uppercase text-xs"> ({source})</span>
                                        }
                                    </div>
                                    <div>
                                        <p>
                                            {source !== "rss" && source !== "search" && <span className="text-gray-500">. . .</span>}
                                            {s.snippet && stripTags(s.snippet).substring(0, 200)}...
                                        </p>
                                    </div>
                                </div>
                                <div className="w-4/12 gap-2 min-2/12 h-full flex flex-col">
                                    <div className="flex flex-row justify-end items-start mt-2 rounded-md">
                                        {s.first_image_url &&
                                                <Image
                                                    alt={s.title}
                                                    width={100}
                                                    height={100}
                                                    src={s.first_image_url}
                                                    className="object-contain rounded-md min-w-12!  object-right"
                                                    quality={50}
                                                />
                                            }
                                    </div>
                                    <Link target="_blank" href={source === "snl" ? s.article_url || "" : s.permalink || ""}>
                                        <span className="bg-moreredish text-white text-xs font-thin flex flex-row items-center px-2 py-1 rounded-md justify-start rounded-r-3xl">
                                            {source === "ndla" && "NDLA.NO"}
                                            {source === "snl" && "snl.no"}
                                            {(source === "rss" || source === "search") && <>{s.permalink.split("/")[2]}</>}
                                            <ChevronRight size="12"/>
                                        </span>
                                    </Link>
                                </div>
                                
                                
                            </li>
                        )
                    })}
                </ul>
            </div>    
        </div>
    )
}