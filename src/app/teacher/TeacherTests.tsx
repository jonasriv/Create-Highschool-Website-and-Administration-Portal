"use client";

import { useTeacherStore } from "./store";
import { useState } from "react";
import TestEditor from "./tests/editor/TestEditor";
import TestList from "./tests/list/TestLIst";

type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};


export default function TeacherTests({ user, msConnected }: Props) {
    const dark = useTeacherStore((s) => s.dark);
    const showingTests = useTeacherStore((s) => s.showingTests);
    const [mode, setMode] = useState<"edit" | "monitor">("edit");

    if (!user || !user.email || user.email.trim() !== "jonas.rislow.iversen@create.no") return (<div>Her kommer prøver</div>)
    return(
        <div className={`flex flex-row p-2 gap-0 divide-x-2 divide-black h-[calc(100vh-4rem)] rounded-md`}>
        
        
        
            {/* Mine prøver */}
            <div className={`${showingTests ? "w-4/12" : "w-1/12"} transition-all duration-200 bg-white/80 rounded-l-sm py-2`}>
                <TestList user={user} msConnected={msConnected}/>
            </div> 

            {/* Ny prøve ELLER Rediger prøve ELLER Overvåke prøve*/}
            <div className={`${showingTests ? "w-8/12" : "w-11/12"} transition-all duration-200 bg-white/80 h-full rounded-r-sm p-2 overflow-b-scroll`}>
                {mode === "edit" && <TestEditor user={user} msConnected={msConnected}/>}
            </div>
        </div>
    )
}