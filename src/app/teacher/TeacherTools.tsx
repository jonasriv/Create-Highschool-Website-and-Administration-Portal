import { useTeacherStore } from "./store";
import ChatBot from "./components/ChatBot";
import TeacherNotes from "./components/TeacherNotes";

type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};


export default function TeacherTools({  }: Props) {
    const panelsOpen = useTeacherStore((s) => s.panelsOpen);
    const togglePanel = useTeacherStore((s) => s.actions.togglePanel);
    return (
        <div className="w-full h-full">
            <div className="w-full h-6 flex justify-start ml-2 z-50 ">
                <ul className="flex flex-row gap-4 p-2 justify-around bg-slate-600 h-full w-56 uppercase text-xs rounded-b-md text-slate-400">
                    <li 
                        onClick={() => togglePanel("chat")}
                        className="flex flex-row justify-center items-center gap-1 font-mina cursor-pointer"
                    >
                        Chatbot
                        <div className={`w-4 h-4 border-[1px] border-white rounded-full mb-1 ${panelsOpen.chat ? "bg-moreredish" : ""}`}></div>
                    </li>
                    <li 
                        onClick={() => togglePanel("notes")}
                        className="flex flex-row justify-center items-center gap-1 font-mina cursor-pointer"
                    >
                        Notater
                        <div className={`w-4 h-4 border-[1px] border-white rounded-full mb-1 ${panelsOpen.notes ? "bg-moreredish" : ""}`}></div>
                    </li>
                </ul>
            </div>
            {/* place for actual tools */}
            <div className="px-2 mt-2 flex gap-4 flex-row justify-start items-start w-[calc(100vw-11rem)]">
            {/* ChatBot panel */}
            <ChatBot/>
            <TeacherNotes/>
            </div>
        </div>
    )
}