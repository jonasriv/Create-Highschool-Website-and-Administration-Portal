"use client";

import { useElevStore } from "./store";
import ElevHeader from "./ElevHeader";
import ChatBot from "./components/ChatBot";
import MyNotes from "./components/MyNotes";
import SearchComponent from "./components/SearchComponent";
import ElevNavbar from "./components/ElevNavbar";

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

    const openCount = Object.values(panelsOpen).filter(Boolean).length;
    const cols = Math.max(1, Math.min(openCount, 3));

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

            <ElevHeader user={user} msConnected={msConnected} />
            {showingNavbar && <ElevNavbar/> }

            <main className="flex-1 min-h-0 overflow-hidden relative flex-col gap-4 w-full max-w-full justify-start items-start ">
                {/* TOP MENU IN MAIN */}
               
                {/* Main Content */}
                <div className={`w-full flex flex-col justify-start items-start overflow-scroll `}>
                    <div
                        className="grid gap-2 mt-2 justify-center items-center w-full p-2 overflow-hidden"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                        <div className={`${panelsOpen.chat ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-slate-300 text-black border-black" : "bg-black/60 text-white border-white" }`}><ChatBot /></div>
                        <div className={`${panelsOpen.search ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-slate-300 text-black border-black" : "bg-black/60 text-white border-white" }`}><SearchComponent /></div>
                        <div className={`${panelsOpen.notes ? "" : "hidden"} h-full rounded-xl min-h-0 max-w-[1000px] max-h-[calc(100vh-240px)] overflow-y-scroll ${dark ? "bg-slate-300 text-black border-black" : "bg-black/60 text-white border-white" }`}><MyNotes /></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
