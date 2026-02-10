import { useElevStore } from "../store"

export default function MobileNavbar() {
    const mobilePanel = useElevStore((s) => s.mobilePanel);
    const setMobilePanel = useElevStore((s) => s.actions.setMobilePanel);
    const dark = useElevStore((s) => s.dark);

    return (
        <div className={`md:hidden w-screen flex flex-row justify-between items-center backdrop-blur-xl ${dark ? "bg-black/60" : "bg-transparent"} border-t-[1px]`}>

          <button onClick={() => setMobilePanel("chat")} className={`w-1/3 p-2 tracking-wider font-bold ${mobilePanel.toString().toLowerCase() === "chat" ? "text-redish bg-white/10" : ""}`}>CHAT</button>
          <button onClick={() => setMobilePanel("notes")} className={`w-1/3 p-2  tracking-wider font-bold ${mobilePanel.toString().toLowerCase() === "notes" ? "text-redish bg-white/10" : ""}`}>NOTES</button>
          <button onClick={() => setMobilePanel("search")} className={`w-1/3 p-2 tracking-wider font-bold ${mobilePanel.toString().toLowerCase() === "search" ? "text-redish bg-white/10" : ""}`}>SEARCH</button>
        </div>
    )
}