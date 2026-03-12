'use client';
import { useTeacherStore } from "../store"
import { Menu, ChevronRight, ChevronLeft } from "lucide-react";
export default function Sidebar() {
    const dark = useTeacherStore((s) => s.dark);
    const windowOpen = useTeacherStore((s) => s.windowOpen);
    const setWindow = useTeacherStore((s) => s.actions.setWindowOpen);
    const showingMenu = useTeacherStore((s) => s.showingMenu);
    const toggleMenu = useTeacherStore((s) => s.actions.toggleMenu);

    return (
        <div 
            className={`w-44 ${showingMenu ? "ml-0" : "-ml-32"} transition-all duration-300 h-[calc(100vh-22px)] ${dark ? "bg-black/90 text-slate-200" : "bg-white/80 text-slate-800"} flex flex-col justify-start items-center font-mina`}

        >            
        <div 
            className="w-full h-8 text-black flex flex-row justify-end items-center cursor-pointer hover:bg-black/10 rounded-sm" 
            title="Vis/skjul menyen"
            onClick={() => toggleMenu()}
        >
            {showingMenu ? 
                <div className="gap-0 justify-around flex flex-row"><ChevronLeft size="20" color=" #ff8000"/><Menu size="20" color=" #ff8000"/></div>
            : 
                <div className="flex flex-row"><Menu size="20" color=" #ff8000"/><ChevronRight size="20" color=" #ff8000" /></div>
            }
        </div>

            <ul className={`w-full px-0  divide-y-2 divide-gray-500 border-y-2 ${dark ? "border-gray-800 divide-gray-800" : "border-gray-400 divide-gray-400"} font-normal mt-24`}>
                <li
                    onClick={() => setWindow("tools")} 
                    className={`font-bold cursor-pointer hover:bg-evenmoreredish w-full p-2 text-center flex flex-row gap-2 justify-between items-center tracking-wider h-14 ${windowOpen === "tools" ? "bg-slate-500 text-slate-100" : "bg-transparent "}`}
                >
                    Verktøy
                    <ChevronRight/>
                </li>
                <li
                    onClick={() => setWindow("tests")} 
                    className={`font-bold cursor-pointer hover:bg-evenmoreredish w-full p-2 text-center flex flex-row gap-2 justify-between items-center tracking-wider h-14 ${windowOpen === "tests" ? "bg-slate-500 text-slate-100" : "bg-transparent "}`}
                >
                    Prøver
                    <ChevronRight/>
                </li>
                <li
                    onClick={() => setWindow("other")} 
                    className={`font-bold cursor-pointer hover:bg-evenmoreredish w-full p-2 text-center flex flex-row gap-2 justify-between items-center tracking-wider h-14 ${windowOpen === "other" ? "bg-slate-500 text-slate-100" : "bg-transparent "}`}
                >
                    Annet
                    <ChevronRight/>
                </li>
            </ul>
        </div>
    )
}