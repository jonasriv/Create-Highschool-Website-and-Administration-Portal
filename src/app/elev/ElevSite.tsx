"use client";

import { useState } from "react";
import ElevHeader from "./ElevHeader";
import ChatBot from "./components/ChatBot";
import MyNotes from "./components/MyNotes";
import SearchComponent from "./components/SearchComponent";

import { ChevronDown, ChevronUp } from "lucide-react";

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
    const [showingPanels, setShowingPanels] = useState({
        notes: false,
        chat: false,
        search: false
    });

    // const numberOfPanels = Object.values(showingPanels).filter(Boolean).length;

    return (
        <div
            className="flex flex-col h-screen w-screen bg-white/80 overflow-hidden pb-12"
            style={{
                backgroundColor: "black",
                backgroundImage: `url(${internalBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <ElevHeader user={user} msConnected={msConnected} />

            <main className="flex relative flex-col gap-4 w-full max-w-full justify-start items-start overflow-scroll">
                {/* TOP MENU IN MAIN */}
                <div className="flex flex-col justify-start items-start w-full max-w-full bg-black/60 backdrop-blur-md  border-white">
                <ul className="flex flex-row w-full justify-center items-center text-md font-bold tracking-widest font-mina">
                    <li
                    className={`transition-all duration-300 w-full h-12 flex flex-row justify-center items-center cursor-pointer ${
                        showingPanels.notes ? "border-b bg-white/20" : ""
                    }`}
                    onClick={() => setShowingPanels(prev => ({
                        ...prev,
                        notes: !prev.notes,
                    }))}            >
                    Mine notater
                    {showingPanels.notes ? <ChevronUp/> : <ChevronDown/>}
                    </li>

                    <li
                        className={`transition-all duration-300 w-full h-12 flex flex-row justify-center items-center cursor-pointer ${
                            showingPanels.chat ? "bg-white/20 border-b" : ""
                        }`}
                        onClick={() => {
                        setShowingPanels(prev => {
                            const nextChat = !prev.chat;
                            return {
                            ...prev,
                            chat: nextChat,
                            };
                        });
                        }}
                    >
                        Chatbot
                        {showingPanels.chat ? <ChevronUp/> : <ChevronDown/>}        
                    </li>

                    <li
                        className={`transition-all duration-300 w-full h-12 flex flex-row justify-center items-center cursor-pointer ${
                            showingPanels.search ? "bg-white/20 border-b" : ""
                        }`}
                        onClick={() => setShowingPanels(prev => ({
                            ...prev,
                            search: !prev.search,
                        }))}
                    >
                        Søk
                        {showingPanels.search ? <ChevronUp/> : <ChevronDown/>}
                    </li>
                </ul>
                </div>

                {/* Main Content */}
                <div className="w-full flex flex-col justify-start items-start overflow-scroll">
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-start items-start w-full h-auto rounded-xl p-2`}>
                        {showingPanels.chat && <ChatBot />}

                        {showingPanels.notes && <MyNotes />}

                        {showingPanels.search &&<SearchComponent/>}
                    </div>
                </div>
            </main>
        </div>
    );
}
