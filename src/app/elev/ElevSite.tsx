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
import { X } from "lucide-react";

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
    const hideNavbar = useElevStore((s) => s.actions.hideNavbar)
    const navRef = useRef<HTMLDivElement | null>(null);
    const toggleRef = useRef<HTMLDivElement | null>(null);
    const mobilePanel = useElevStore((s) => s.mobilePanel);
    const showingFeedback = useElevStore((s) => s.showingFeedback);
    const [sendingFeedback, setSendingFeedback] = useState(false);
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
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [hideNavbar, showingNavbar, showingFeedback, hideFeedback]);

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
            className="relative flex flex-col h-screen w-screen overflow-hidden pb-12"
            style={{
                backgroundColor: "black",
                backgroundImage: `url(${internalBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >


            <ElevHeader user={user} toggleRef={toggleRef} msConnected={msConnected} />

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
                            <li>- Fungerer chatboten bra/dårlig?</li>
                            <li>- Hva skulle vært annerledes? </li> 
                            <li>- Hva med søkeboksen?</li>
                            <li>- Bruker du notater-appen?</li>
                            <li>- Annet?</li>
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
            {/* Desktop navbar */}
            <div ref={navRef}>{showingNavbar && <ElevNavbar /> }</div>
            
            {/* desktop main */}
            <main className="hidden md:block flex-1 min-h-0 overflow-hidden relative flex-col gap-4 w-full max-w-full justify-start items-start ">
                {/* Main Content */}
                <div className={`w-full flex flex-col justify-start items-start overflow-scroll `}>
                    <div
                        className="grid gap-2 mt-2 justify-center items-center w-full p-2 overflow-hidden"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                        <div className={`${panelsOpen.chat ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><ChatBot /></div>
                        <div className={`${panelsOpen.search ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><SearchComponent /></div>
                        <div className={`${panelsOpen.notes ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><MyNotes /></div>
                    </div>
                </div>
            </main>
            {/* mobile main */}
            <main className="md:hidden flex-1 min-h-0 overflow-hidden relative flex-col gap-4 w-full max-w-full justify-start items-start ">
                {/* Main Content */}
                <div className={`w-full flex flex-col justify-start items-start overflow-scroll `}>
                    <div
                        className="grid gap-2 justify-center items-center w-full overflow-hidden grid-cols-1"
                        
                    >
                        <div className={`${mobilePanel === "chat" ? "" : "hidden"} h-full w-full overflow-y-hidden ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><ChatBot /></div>
                        <div className={`${mobilePanel === "search" ? "" : "hidden"} h-full  w-full overflow-y-hidden ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><SearchComponent /></div>
                        <div className={`${mobilePanel === "notes" ? "" : "hidden"} h-full  w-full overflow-y-hidden ${dark ? "bg-black/60 text-white border-white" : "bg-white/70 text-black border-black" }`}><MyNotes /></div>
                        
                    </div>
                </div>                
            </main>         
                        
   
        </div>
    );
}
