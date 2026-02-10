"use client";

import { useEffect, useState, useRef } from "react"
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
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

  // NYHETER-spesifikt
  provider?: string;     
  publishedAt?: string;  // ISO string
};


export default function SearchComponent() {
    const [searchString, setSearchString] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [source, setSource] = useState<"snl" | "ndla" | "news">("snl");
    const lookupEvent = useElevStore((s) => s.lookupEvent);
    const clearLookup = useElevStore((s) => s.actions.clearLookup)

    const inputRef = useRef<HTMLInputElement | null>(null);

    function stripTags(html: string) {
        return String(html ?? "").replace(/<[^>]*>/g, "");
    }

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
        <div className="elev_component_div">
            <div className="flex flex-col items-start justify-between gap-2 w-full">
                <div className="rounded-md bg-transparent overflow-hidden w-full">
                    <div className="p-2 border-b border-redish mb-2 w-full">
                        <div className="elev_component_header">Temasøk</div>
                            <div className="hidden md:block text-sm font-mina font-italic">
                                Tema, nøkkelord, personer 
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
                        onClick={() => setSource("snl")}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-thin rounded ${source === "snl" ? "bg-redish text-white" : "bg-gray-300 text-black"}`}
                    >
                        SNL
                    </button>
                    <button
                        type="button"
                        onClick={() => setSource("ndla")}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-thin rounded ${source === "ndla" ? "bg-redish text-white" : "bg-gray-300 text-black"}`}
                    >
                    NDLA
                    </button>
                    <button
                        type="button"
                        onClick={() => setSource("news")}
                        className={`px-3 py-1 shadow-md border border-black/10 uppercase text-sm font-thin rounded ${source === "news" ? "bg-redish text-white" : "bg-gray-300 text-black"}`}
                    >
                    Nyheter
                    </button>                    
                </div>
            </div>
            {/* dropdown */}
            <h2 className="w-full text-left text-sm p-1 font-mina font-normal tracking-wider">
                {suggestions.length > 0 ? "" : searchString.length < 3 ? "Skriv inn et søk..." : "Juster søket"}
                
            </h2>
            <div className="mt-1 flex flex-col p-2 rounded-md border-redish overflow-hidden">
                <ul className="grid grid-cols-1 gap-2 overflow-auto text-sm text-black">
                    {suggestions.map((s, idx) => {
                        const active = idx === activeIndex;
                        return (
                            <li 
                                key={`#{s.title}-${idx}`}
                                className={`rounded-md bg-white shadow-md gap-4 flex flex-row justify-between items-start px-3 py-2 h-auto cursor-pointer ${active ? "" : ""} odd:bg-white even:bg-white/90`}
                            >
                                <div className="w-8/12 max-w-10/12">
                                    <div className="capitalize text.md font-bold mb-2">
                                        {s.title} 
                                        {source !== "news" && <span className="uppercase text-xs"> ({source})</span>}
                                        {source === "news" && <span className="uppercase text-xs"> ({s.provider})</span>}
                                    </div> 
                                    <div>
                                        
                                        <p>
                                            {source !== "news" &&<span className="text-gray-500">. . .</span> }
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
                                    <Link target="_blank" href={source === "news" ? s.permalink || "" : source === "snl" ? s.article_url || "" : s.permalink || ""}>
                                        <span className="bg-redish text-white text-xs font-bold flex flex-row items-center px-2 py-1 rounded-md justify-between rounded-r-3xl pl-4">
                                            {source === "ndla" && "NDLA.NO"}
                                            {source === "snl" && "snl.no"}
                                            
                                            {source === "news" && <>{s.permalink.split("/")[2]}</>}
                                            {/* <Globe size="12"/> */}
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