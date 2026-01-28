"use client";

import { useState } from "react";
import ElevHeader from "./ElevHeader";
import ChatBot from "./components/ChatBot";
import MyNotes from "./components/MyNotes";
import { ChevronDown } from "lucide-react";

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

type Panel = "notes" | "chat" | "search";

export default function ElevSite({ user, msConnected }: Props) {
  const internalBackground = "/images/iStock-1069853936_compressed3.jpg";
  const [panel, setPanel] = useState<Panel>("chat");

  return (
    <div
      className="h-screen w-screen bg-white/40"
      style={{
        backgroundColor: "black",
        backgroundImage: `url(${internalBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ElevHeader user={user} msConnected={msConnected} />

      <main className="flex relative top-96 flex-col gap-4 h-[calc(100vh-280px)] w-screen justify-start items-start overflow-y-scroll">
        {/* left side menu for desktop */}
        <div className="flex flex-col w-full bg-black/60 backdrop-blur-md border-t-2 border-white">
          <ul className="flex flex-row w-full justify-center items-center text-md font-bold tracking-widest uppercase font-mina">
            <li
              className={`transition-all duration-300 w-full h-16 flex flex-col justify-center items-center cursor-pointer ${
                panel === "notes" ? "bg-white/20" : ""
              }`}
              onClick={() => setPanel("notes")}
            >
              Mine notater
              <ChevronDown/>
            </li>

            <li
              className={`transition-all duration-300 w-full h-16 flex flex-col justify-center items-center cursor-pointer ${
                panel === "chat" ? "bg-white/20" : ""
              }`}
              onClick={() => setPanel("chat")}
            >
              Chatbot
              <ChevronDown/>              
            </li>

            <li
              className={`transition-all duration-300 w-full h-16 flex flex-col justify-center items-center cursor-pointer ${
                panel === "search" ? "bg-white/20" : ""
              }`}
              onClick={() => setPanel("search")}
            >
              Søk
              <ChevronDown/>              
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-screen mx-8 flex flex-col justify-center items-center">
          <div className="flex bg-black/70 w-11/12 h-auto rounded-xl p-2 backdrop-blur-2xl ring-1 ring-white/10">
            {panel === "chat" && <ChatBot />}

            {panel === "notes" && <MyNotes />}

            {panel === "search" && (
              <div className="p-4 text-white/80">
                <div className="font-semibold mb-2">Søk</div>
                <div className="text-sm opacity-80">
                  Kommer: SNL + NDLA + Google (ny fane)
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
