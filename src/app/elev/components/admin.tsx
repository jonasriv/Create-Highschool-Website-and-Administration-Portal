/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

type FeedbackItem = {
_id: string;
name: string;
updatedAt: string;
createdAt: string;
content: string;
};

export default function MyFeedback() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadList();
    }, []);

    async function loadList() {
        setIsLoading(true);
        try {
        const res = await fetch("/api/feedback", { cache: "no-store" });
        if (!res.ok) throw new Error("Kunne ikke hente feedback");
        const data = await res.json();
        setFeedbacks(data.feedbacks ?? []);
        // auto-velg første
        
        } catch (e: any) {
        console.log(e?.message ?? "Noe gikk galt");
        } finally {
        setIsLoading(false);
        }
    }

    return (<div>
        
        <h2>Antall feedbacks: {feedbacks.length}</h2>
        {isLoading &&<Spinner/>}
        <ul className="w-[1000px] rounded-md bg-white/70 min-h-96 p-2 text-black flex flex-col gap-2">
            {feedbacks.map(f => (
                <li className="p-2 bg-black/20 flex flex-row justify-start items-start gap-2 text-sm"key={f._id}>
                    <div>{f.name}: </div><div>{f.content}</div>
                </li>
            )
            )}
        </ul>
    </div>)
}
