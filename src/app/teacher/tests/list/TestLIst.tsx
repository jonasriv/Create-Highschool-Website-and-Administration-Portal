"use client";

import { useEffect } from "react";
import { useTeacherStore } from "../../store";
import { Monitor, Pencil, CalendarFold, Menu, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { HiUserGroup } from "react-icons/hi";

import type { TestDto } from "../dtoTypes";

type Props = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        id?: string;
    };
    msConnected: boolean;
};

export default function TestList({ user }: Props) {
    const { toggleTests, fetchTests } = useTeacherStore((s) => s.actions);
    const showingTests = useTeacherStore((s) => s.showingTests);

    const tests = useTeacherStore((s) => s.tests);
    const testsLoading = useTeacherStore((s) => s.testsLoading);
    const testsError = useTeacherStore((s) => s.testsError);

    const expandedTests = useTeacherStore((s) => s.expandedTests);
    const expandTest = useTeacherStore((s) => s.actions.expandTest);
    const shrinkTest = useTeacherStore((s) => s.actions.shrinkTest);
    const editingTest = useTeacherStore((s) => s.editingTest);
    const setEditingTest = useTeacherStore((s) => s.actions.setEditingTest);
    const setMonitoringTest = useTeacherStore((s) => s.actions.setMonitoringTest);
    const startNewTest = useTeacherStore((s) => (s.actions as any).startNewTest) as () => void;

    function convertDate(dbDate: string) {
    return new Date(dbDate).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

return (
    <div>
        <div className="cursor-pointer flex flex-row items-start justify-between" onClick={() => toggleTests()}>
            <h3
                className="p-2 font-semibold flex w-full flex-row justify-between items-center"
                
            >
                {showingTests && <span className="w-full">Mine prøver</span>}
            </h3>
            <div
                className="w-full h-8 mr-2 text-black flex flex-row justify-end items-center cursor-pointer"
                title="Vis/skjul menyen"
            >
                {showingTests ? (
                    <div className="gap-0 justify-around flex flex-row">
                    <ChevronLeft size="20" color="#ff8000" />
                    <Menu size="20" color="#ff8000" />
                    </div>
                ) : (
                    <div className="flex flex-row">
                    <Menu size="20" color="#ff8000" />
                    <ChevronRight size="20" color="#ff8000" />
                    </div>
                )}
            </div>
        </div>

        {testsLoading && <p className="text-sm text-slate-600 px-2">Henter prøver…</p>}
        {testsError && <p className="text-sm text-red-600 px-2">{testsError}</p>}
        <ul className="w-full divide-y divide-slate-600 border-y border-slate-600 mt-4">
            {tests?.length > 0 ? (
            tests.map((t: TestDto, idx) => (
                <li
                    key={t._id ?? `${t.title ?? "untitled"}-${t.createdAt ?? "no-date"}-${idx}`}
                    className={`bg-white/60 shadow-gray-300 w-full px-1 py-1 flex flex-col justify-start items-center`}
                >
                    <div className="w-full flex flex-row justify-between gap-2 items-center">
                        {/* TITLE */}
                        <div className="w-[100%] text-slate-700 h-12 tracking-normal font-bold text-sm flex flex-row items-center justify-between px-2 font- rounded-sm ">
                            {showingTests ? <p>{t.title?.slice(0, 100)}</p> : <p>{t.title?.slice(0, 100)}...</p>}
                        </div>
                     
                        <div className={`${showingTests ? "max-w-96" : "max-w-0 overflow-hidden"} flex flex-row justify-between items-center`}>
                            {/* Chevrons for toggler */}
                            <div
                                className="w-full opacity-100 shadow-md hover:opacity-100 transition-all duration-300 mr-2 bg-transparent cursor-pointer hover:bg-black/10 p-1 flex justify-center items-center rounded-full"
                                onClick={() => {
                                    if (t._id && expandedTests.includes(t._id)) {
                                        shrinkTest(t._id);
                                    } else if (t._id) {
                                        expandTest(t._id);
                                    }
                                }
                                }
                            >
                            {t._id && expandedTests.includes(t._id) ? <ChevronUp size="12" color="black"/> : <ChevronDown size="12" color="black"/>}

                            </div>                                 
                            {/* Status light */}
                            <div className="w-5 h-5 border border-slate-700 flex flex-row justify-center items-center rounded-full">
                                
                                <div
                                    title={t.status}
                                    className={`rounded-full h-4 w-4 ${
                                    t.status?.toLowerCase().trim() === "draft"
                                        ? "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-amber-600 to-amber-400"
                                        : t.status?.toLowerCase().trim() === "published"
                                        ? "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-600 to-green-400"
                                        : "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-500 to-gray-400"
                                    }`}
                                />
                            </div>
                        </div> 

                    </div>

                    {/* Div for details and actions - toggleable */}
                    {t._id &&
                        <div className={`${expandedTests.includes(t._id) && showingTests ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0"} px-2 transition-all duration-300 h-auto flex flex-col items-between w-full`}>
                            {/* Class / subject */}
                            <div className="flex flex-row gap-2 justify-start items-center text-slate-800 text-sm mb-2">
                                <HiUserGroup color="darkblue"/>
                                {t.subject}
                            </div>
                            {/* Dates */}
                            <span
                                className={`flex flex-row items-center justify-start  gap-2 ${
                                showingTests ? "max-w-64" : "max-w-0 overflow-hidden"
                                } transition-all duration-300`}
                            >
                                <p className="text-sm flex flex-row justify-start items-center text-white w-full">
                                {t.createdAt && (
                                    <span className="flex flex-row items-start gap-2 text-slate-600" title="Date - created and last updated">
                                        <CalendarFold size="16" />
                                        {convertDate(t.createdAt)} ({t.updatedAt &&convertDate(t.updatedAt)})
                                    </span>
                                )}
                                </p>
                            </span>
                            <span className="flex flex-row gap-2 my-2">
                                <div
                                    title="Monitor"
                                    onClick={() => t._id && setMonitoringTest(t._id)}
                                    className="shadow-md w-10 h-8 bg-white/60 hover:bg-white/80 cursor-pointer rounded-sm flex flex-row justify-center items-center"
                                >
                                 <Monitor size="16" color="black" />
                                </div>

                                {t._id && 
                                <div
                                    onClick={() => t._id && setEditingTest(t._id)}
                                    title="edit"
                                    className={`${t._id === editingTest ? "opacity-30 cursor-auto" : ""} shadow-md w-10 h-8 bg-white/60 hover:bg-white/80 cursor-pointer rounded-sm flex flex-row justify-center items-center`}
                                >
                                    <Pencil size="16" color="black" />
                                </div>
                                }
                            </span>                                
                        </div>
                    }
                </li>
            ))
            ) : (
            !testsLoading && <p className="px-2 py-2 text-slate-600">Ingen prøver</p>
            )}

        </ul>
        <button
            type="button"
            onClick={startNewTest}
            className={`bg-blue-500 h-12 shadow-gray-300 w-4/5 mx-auto mt-4 rounded-sm px-1 py-1 flex flex-row justify-center uppercase text-white font-bold hover:bg-blue-600 cursor-pointer items-center`}
        >
            Ny prøve<Plus size="16"/>
        </button>
    </div>
);
}
