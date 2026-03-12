"use client";

import { useTeacherStore } from "./store";
import { useState } from "react";
import TestList from "./tests/list/TestList";
import TestEditorContainer from "./tests/editor/TestEditorContainer";
import TestMonitorContainer from "./tests/monitor/TestMonitorContainer";

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
    const editingOrMonitoring = useTeacherStore((s) => s.editingOrMonitoring);

    if (!user || !user.email || user.email.trim() !== "jonas.rislow.iversen@create.no") return (<div>Her kommer prøver</div>)
    return(
        <div className={`flex flex-row gap-0 divide-x divide-slate-400 h-[calc(100vh-4rem)] border-l border-slate-400`}>
        
        
        
            {/* Mine prøver */}
            <div className={`${showingTests ? "w-4/12" : "w-1/12"} transition-all duration-200 ${dark ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-800"} h-[calc(100vh-80px)] rounded-l-sm py-2`}>
                <TestList user={user} msConnected={msConnected}/>
            </div> 

            {/* Editor eller MONITOR */}
      <div
        className={`${showingTests ? "w-8/12" : "w-11/12"} transition-all duration-200 ${
          dark ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-800"
        } h-[calc(100vh-80px)] rounded-r-sm p-2 overflow-y-scroll`}
      >
        {editingOrMonitoring === "editing" && <TestEditorContainer user={user} />}
        {editingOrMonitoring === "monitoring" && <TestMonitorContainer user={user} />}
        
        {!editingOrMonitoring && (
          <div className="opacity-70 text-sm p-2">Velg en prøve eller lag en ny.</div>
        )}
      </div>
    </div>
        
    )
}