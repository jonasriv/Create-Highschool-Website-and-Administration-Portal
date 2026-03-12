"use client";

import { useEffect, useRef, useState } from "react";
import { useElevStore } from "./store";
import ElevHeader from "./ElevHeader";
import ChatBot from "./components/ChatBot";
import MyNotes from "./components/MyNotes";
import SearchComponent from "./components/SearchComponent";
import MyFeedback from "./components/admin";
import ElevNavbar from "./components/ElevNavbar";
import MobileNavbar from "./components/MobileNavbar";
import Spinner from "@/components/ui/Spinner";
import { X, MessageSquare, Search as SearchIcon, FileText } from "lucide-react";

type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // hvis du har (session.user as any).id:
    id?: string;
};
msConnected: boolean;
};

interface Feedback {
    anonymous: boolean,
    content: string,
    name?: string,
}

// type Panel = "notes" | "chat" | "search";

export default function ElevSite({ user, msConnected }: Props) {
    const internalBackground = "/images/iStock-1069853936_compressed3.jpg";
    //   const [panel, setPanel] = useState<Panel>("chat");
    const panelsOpen = useElevStore((s) => s.panelsOpen);
    const showingNavbar = useElevStore((s) => s.showingNavbar);
    const dark = useElevStore((s) => s.dark);
    const hideNavbar = useElevStore((s) => s.actions.hideNavbar);
    const togglePanel = useElevStore((s) => s.actions.togglePanel);
    const lookupEvent = useElevStore((s) => s.lookupEvent);
    const navRef = useRef<HTMLDivElement | null>(null);
    const toggleRef = useRef<HTMLDivElement | null>(null);
    const mobilePanel = useElevStore((s) => s.mobilePanel);
    const showingFeedback = useElevStore((s) => s.showingFeedback);
    const [sendingFeedback, setSendingFeedback] = useState(false);
    const [searchHighlight, setSearchHighlight] = useState(false);
    const hideFeedback = useElevStore((s) => s.actions.hideFeedback);
    const hideAdminFeedback = useElevStore((s) => s.actions.hideAdminFeedback);
    const [feedback, setFeedback] = useState<Feedback>({anonymous: false, content: "", name: "anonymous"});
    const showingAdminFeedback = useElevStore((s) => s.showingAdminFeedback);

    const openCount = Object.values(panelsOpen).filter(Boolean).length;
    const cols = Math.max(1, Math.min(openCount, 3));

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && showingNavbar) {
                hideNavbar(); 
            }
            if (e.key === "Escape" && showingFeedback) {
                hideFeedback(); 
            }         
            if (e.key === "Escape" && showingAdminFeedback) {
                hideAdminFeedback(); 
            }                  
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [hideNavbar, showingNavbar, showingFeedback, hideFeedback, showingAdminFeedback, hideAdminFeedback]);

    useEffect(() => {
        if (!showingNavbar && !showingFeedback && !showingAdminFeedback) return;

        const opts = { capture: true } as const;

        function onPointerDown(e: PointerEvent) {
            const t = e.target as Node | null;
            if (!t) return;

            if (navRef.current?.contains(t)) return;      // klikk inni nav
            if (toggleRef.current?.contains(t)) return;   // klikk på hamburger/toggler

            hideNavbar();
            hideFeedback();
            hideAdminFeedback();
        }

        document.addEventListener("pointerdown", onPointerDown, opts);
        return () => document.removeEventListener("pointerdown", onPointerDown, opts);
    }, [hideNavbar, showingNavbar, hideFeedback, showingFeedback, showingAdminFeedback, hideAdminFeedback]);

    useEffect(() => {
        if (!lookupEvent) return;
        setSearchHighlight(true);
        const t = setTimeout(() => setSearchHighlight(false), 1300);
        return () => clearTimeout(t);
    }, [lookupEvent?.id]);

    async function handleSubmitFeedback() {
        setSendingFeedback(true);
        if (feedback.content.length === 0) {
            alert("Du har ikke skrevet noe!");
            return;
        }
        const nameToSend = feedback.anonymous ? "anonymous" : user?.name || "ukjent";
        const contentToSend = feedback.content;
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameToSend, content: contentToSend }),
            });
            if (!res.ok) throw new Error("Kunne ikke sende feedback");
            
            setFeedback((f) => ({...f, content: "", name: "", anonymous: false}));
            setSendingFeedback(false);
            hideFeedback();
        } catch (e) {
            console.log("Kunne ikke sende feedback", e);
            alert("Noe gikk feil. Finn Jonas i kjelleren");
            
            hideFeedback();
        }

    }
    return (
        <div
            className="relative flex flex-col h-screen w-screen overflow-hidden"
            style={{
                backgroundColor: "black",
                backgroundImage: `url(${internalBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >


            <ElevHeader user={user} toggleRef={toggleRef} msConnected={msConnected}/>

            {/* ADMIN FEEDBACK-MODAL */}
            {user?.email === "jonas.rislow.iversen@create.no" && showingAdminFeedback && 
                <div ref={navRef} className="fixed mt-20 backdrop-blur-sm inset-0 flex items-center justify-start pt-8 bg-gray-700 bg-opacity-50 z-50 flex-col gap-12">
                        <MyFeedback/>
                </div>}

            {/* FEEDBACK-modal */}
            {showingFeedback &&
            <div className="fixed mt-20 backdrop-blur-sm inset-0 flex items-center justify-start pt-8 bg-gray-700 bg-opacity-50 z-50 flex-col gap-12">
                <div ref={navRef}  className="w-96 h-[500px] bg-white/70 rounded-md text-black p-4">
                    <h2 className="font-bold font-mina w-full border-b-2 border-redish flex flex-row justify-between items-center">
                        ELEVHUB FEEDBACK
                        <div onClick={hideFeedback} className="p-1 bg-black/10 hover:bg-black/20 rounded-full mb-2 cursor-pointer"><X size="18"/></div>
                    </h2>
                    <div className="py-2">
                        <ul className="text-xs my-2 font-mina">
                            <li>- Hjelper boten deg? Er den irriterende? </li>
                            <li>- Lærer du noe? </li>
                            <li>- Hva burde evt. vært annerledes? </li> 
                            <li>- Feedback på søkeboksen?</li>
                            <li>- Hva med notater-appen?</li>
                        </ul>
                        <textarea 
                            className="rounded-md text-black border border-redish h-56 text-sm max-h-64 w-full  p-2" 
                            placeholder="Skriv tilbakemelding her..."
                            value={feedback.content}
                            onChange={(e) => setFeedback((f) => ({...f, content: e.target.value}))}
                        />
                        <p className="flex flex-row justify-start gap-2 items-center font-mina my-2 text-sm">
                            Jeg vil være anonym
                            <input 
                                type="checkbox"
                                checked={feedback.anonymous}
                                onChange={(e) => setFeedback((f) => ({...f, anonymous: e.target.checked}))}
                            />
                        </p>
                        <button 
                            className="w-full p-2 rounded-md bg-moreredish h-12 font-mina text-white font-black tracking-wider hover:bg-evenmoreredish"
                            onClick={() => handleSubmitFeedback()}
                        >
                            {!sendingFeedback ? "Send feedback" : <Spinner/>}
                        </button>
                    </div>
                </div>
            </div>
            }
            {/* mobile navbar */}
            <MobileNavbar/>
            {/* Desktop navbar (beholdt for click-outside-logikk) */}
            <div ref={navRef}>{showingNavbar && <ElevNavbar navRef={navRef}/> }</div>

            {/* desktop main */}
            <main className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden w-full max-w-full">
                {/* Panel toggle-bar */}
                <div className="flex flex-row justify-start gap-4 px-3 py-1.5 shrink-0">
                    {(["chat", "search", "notes"] as const).map((name) => {
                        const meta = {
                            chat:   { label: "ChatBot",  icon: <MessageSquare size={12}/> },
                            search: { label: "Søk",      icon: <SearchIcon size={12}/> },
                            notes:  { label: "Notater",  icon: <FileText size={12}/> },
                        }[name];
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => togglePanel(name)}
                                className={`flex flex-row gap-1.5 items-center px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                                    panelsOpen[name]
                                        ? "bg-moreredish border-redish text-white font-semibold shadow"
                                        : "bg-white/10 border-white/30 text-white/60 hover:bg-white/20"
                                }`}
                            >
                                {meta.icon} {meta.label}
                            </button>
                        );
                    })}
                </div>
                {/* Grid */}
                <div className="flex-1 min-h-0 overflow-hidden p-2">
                    <div
                        className="grid gap-2 h-full w-full"
                        style={{
                            gridTemplateColumns: openCount === 3
                                ? "2fr 2fr 1.2fr"
                                : `repeat(${cols}, minmax(0, 1fr))`,
                            maxWidth: openCount === 1 ? "640px" : openCount === 2 ? "1100px" : "100%",
                        }}
                    >
                        <div className={`${panelsOpen.chat ? "" : "hidden"} h-full rounded-md min-h-0 overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}><ChatBot /></div>
                        <div
                            className={`${panelsOpen.search ? "" : "hidden"} h-full rounded-md min-h-0 overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}
                            style={searchHighlight ? { animation: "search-flash 1.2s ease-out forwards" } : undefined}
                        ><SearchComponent /></div>
                        <div className={`${panelsOpen.notes ? "" : "hidden"} h-full rounded-md min-h-0 overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}><MyNotes /></div>
                    </div>
                </div>
            </main>
            {/* mobile main */}
            <main className="flex md:hidden flex-col flex-1 min-h-0 overflow-hidden w-full max-w-full">
                <div className="flex-1 min-h-0 overflow-hidden p-0">
                    <div className="h-full w-full">
                        <div className={`${mobilePanel === "chat" ? "h-full" : "hidden"} w-full overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}><ChatBot /></div>
                        <div className={`${mobilePanel === "search" ? "h-full" : "hidden"} w-full overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}><SearchComponent /></div>
                        <div className={`${mobilePanel === "notes" ? "h-full" : "hidden"} w-full overflow-y-auto ${dark ? "bg-black/60 text-white" : "bg-white/70 text-black"}`}><MyNotes /></div>
                    </div>
                </div>
            </main>         
                        
   
        </div>
    );
}
