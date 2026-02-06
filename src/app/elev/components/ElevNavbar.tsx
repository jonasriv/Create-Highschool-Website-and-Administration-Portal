import { useElevStore } from "../store";

export default function ElevNavbar() {
    const showingPanels = useElevStore((s) => s.panelsOpen);
    const togglePanel = useElevStore((s) => s.actions.togglePanel);

    return (
         <div style={{right: "0rem", top:"6rem"}} className="z-50 fixed h-56 max-h-56 right-3 w-40 bg-black/40 backdrop-blur-2xl p-4 rounded-bl-xl text-redish">
                    <ul className="flex flex-col w-full h-full justify-center items-center text-md font-bold tracking-widest font-mina rounded-bl-md gap-2">
                        <li
                            className={`p-2 transition-all duration-300 w-full h-10 flex flex-row justify-between items-center cursor-pointer hover:bg-white/20 rounded-md 
                            }`}
                            onClick={() => togglePanel("notes")}
                        >
                            <span>Notater</span>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {showingPanels.notes && <div className="bg-redish" style={{ width: 12, height: 12, borderRadius: 9999 }} />}
                                </div>
                            </div>
                        </li>

                        <li
                            className={`p-2 transition-all duration-300 w-full h-10 flex flex-row justify-between items-center cursor-pointer hover:bg-white/20 rounded-md 
                            }`}
                            onClick={() => togglePanel("chat")}            
                        >
                            Chatbot
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {showingPanels.chat && <div className="bg-redish" style={{ width: 12, height: 12, borderRadius: 9999 }} />}
                                </div>
                            </div>
                        </li>

                        <li
                            className={`p-2 transition-all duration-300 w-full h-10 flex flex-row justify-between items-center cursor-pointer hover:bg-white/20 rounded-md 
                            }`}
                            onClick={() => togglePanel("search")}            
                        >
                            Søk
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {showingPanels.search && <div className="bg-redish" style={{ width: 12, height: 12, borderRadius: 9999 }} />}
                                </div>
                            </div>                        </li>
                    </ul>
                </div>
    )
}