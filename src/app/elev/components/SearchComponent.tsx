import { useEffect, useState, useRef } from "react"
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Suggestion = {
      headword:string;
      permalink:string;
      clarification:string;
      rank:string;
      snippet:string;
      taxonomy_id:string;
      licence:string;
      title:string;
      first_image_url:string;
      first_image_licence:string;
}

export default function SearchComponent() {
    const [searchString, setSearchString] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

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
                const res = await fetch(`/api/snl/suggest?q=${encodeURIComponent(q)}`);
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
    }, [searchString]);

    function selectSuggestion(s: Suggestion) {
        alert("Du har valgt" + s.title);
    }

    return(
        <div className="w-full bg-black/40 min-h-96 items-start justify-start mx-auto md:p-4 grid grid-cols-1 rounded-md backdrop-blur-2xl gap-4 font-bungee text-white">
            <div className="flex flex-col items-start justify-between gap-2">
                <h2 className="font-semibold font-mina uppercase">Temasøk</h2>
                <div className="flex flex-row gap-1 items-center justify-between border-b-2! border-white! w-full ">
                    <input 
                        ref={inputRef}
                        className="px-2 py-3 rounded-md h-8 tracking-wider text-black font-roboto text-md w-11/12 items-center"
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
                                    selectSuggestion(suggestions[activeIndex]);
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
            </div>
                    
            {/* dropdown */}
            <h2 className="w-full text-center p-1 uppercase font-mina font-bold tracking-wider">
                {suggestions.length > 1 ? "Resultater" : searchString.length < 3 ? "Skriv inn et søk..." : "Juster søket"}
                
            </h2>
            <div className="mt-1 flex flex-col p-2 rounded-md text-black shadow-lg border-black/10 overflow-hidden h-96">
                <ul className="max-h-60 grid grid-cols-1 gap-2 overflow-auto text-sm text-black">
                    {suggestions.map((s, idx) => {
                        const active = idx === activeIndex;
                        return (
                            <li 
                                key={`#{s.title}-${idx}`}
                                className={`rounded-md bg-white gap-4 flex flex-row justify-between items-start px-3 py-2 h-auto cursor-pointer ${active ? "bg-black/10" : "hover:bg-black/5"} odd:bg-white/20`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectSuggestion(s);                                }}
                            >
                                <div className="w-8/12 max-w-8/12">
                                    <div className="capitalise text.md font-bold mb-2">{s.headword}</div> 
                                    <div>
                                        [...] &nbsp;
                                        {s.snippet && stripTags(s.snippet)}
                                        [...]&nbsp;
                                        <Link href={s.permalink} className="hover:underline flex flex-row justify-end text-xs items-center mr-2 text-moreredish  rounded-md p-1 w-full text-right">
                                            Les mer på snl.no <ChevronRight size="14"/>
                                        </Link>
                                    </div>
                                </div>
                                <div className="w-4/12 min-2-4/12 h-full flex flex-row">
                                    {s.first_image_url && 
                                        <div className=" flex flex-row justify-end items-start mt-2 rounded-md">
                                            <Image
                                                alt={s.title}
                                                width={300}
                                                height={300}
                                                src={s.first_image_url}
                                                className="object-cover rounded-md min-w-12!  object-right"
                                                quality={75}      
                                            />
                                        </div>
                                        
                                    }
                                </div>
                                
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}