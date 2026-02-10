"use client";

import { useEffect, useRef } from "react";
import { useElevStore } from "./store";
import ElevHeader from "./ElevHeader";
import ChatBot from "./components/ChatBot";
import MyNotes from "./components/MyNotes";
import SearchComponent from "./components/SearchComponent";
import ElevNavbar from "./components/ElevNavbar";
import MobileNavbar from "./components/MobileNavbar";

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

    const openCount = Object.values(panelsOpen).filter(Boolean).length;
    const cols = Math.max(1, Math.min(openCount, 3));

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && showingNavbar) hideNavbar(); 
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [hideNavbar, showingNavbar]);

    useEffect(() => {
        if (!showingNavbar) return;

        const opts = { capture: true } as const;

        function onPointerDown(e: PointerEvent) {
            const t = e.target as Node | null;
            if (!t) return;

            if (navRef.current?.contains(t)) return;      // klikk inni nav
            if (toggleRef.current?.contains(t)) return;   // klikk på hamburger/toggler

            hideNavbar();
        }

        document.addEventListener("pointerdown", onPointerDown, opts);
        return () => document.removeEventListener("pointerdown", onPointerDown, opts);
    }, [hideNavbar, showingNavbar]);


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
