/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
Calendar,
dateFnsLocalizer,
type Event as RBCEvent,
type View,
} from "react-big-calendar";


import { format, parse, startOfWeek, getDay, startOfDay, addHours } from "date-fns";
import { nb } from "date-fns/locale";

const locales = { "nb-NO": nb };
const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
getDay,
locales,
});

type GraphEvent = {
id: string;
subject?: string;
isAllDay?: boolean;
showAs?: string; // "busy" | "free" etc
start?: { dateTime?: string; timeZone?: string };
end?: { dateTime?: string; timeZone?: string };
location?: { displayName?: string };
};

type CalEvent = RBCEvent & {
id: string;
showAs?: string;
location?: string;
};

function toDate(s?: string) {
if (!s) return new Date();
// Graph kan gi UTC-strings eller "local without Z". Date() håndterer begge ok.
return new Date(s);
}

export default function BigCalendar({
defaultView = "week",
}: {
enabled: boolean;
defaultView?: View;
}) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [events, setEvents] = useState<CalEvent[]>([]);
const [query, setQuery] = useState("");
const [onlyBusy, setOnlyBusy] = useState(false);
const [view, setView] = useState<View>(defaultView);

useEffect(() => {
    (async () => {
    setLoading(true);
    setError(null);

    try {
        const res = await fetch("/api/ms/calendar");
        const data = await res.json();

        if (!res.ok) {
        setError(data?.error ?? "Klarte ikke hente kalender.");
        setEvents([]);
        return;
        }

        const mapped: CalEvent[] = (data?.value ?? []).map((e: GraphEvent) => {
        const start = toDate(e.start?.dateTime);
        const end = toDate(e.end?.dateTime);

        return {
            id: e.id,
            title: e.subject || "(uten tittel)",
            start,
            end,
            allDay: Boolean(e.isAllDay),
            showAs: e.showAs,
            location: e.location?.displayName || "",
        };
        });

        setEvents(mapped);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        setError("Klarte ikke hente kalender.");
        setEvents([]);
    } finally {
        setLoading(false);
    }
    })();
}, []);

const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
    if (onlyBusy && e.showAs && e.showAs !== "busy") return false;
    if (!q) return true;
    const hay = `${e.title ?? ""} ${(e.location ?? "")}`.toLowerCase();
    return hay.includes(q);
    });
}, [events, query, onlyBusy]);

const day = startOfDay(new Date());
const minTime = addHours(day, 8);
const maxTime = addHours(day, 20);

return (
    <div className="backdrop-blur-sm w-full rounded-md p-4 text-white">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
        <h2 className="font-semibold">Kalender</h2>
        {loading && <span className="text-xs opacity-70">Henter…</span>}
        {error && <span className="text-xs text-red-200">{error}</span>}
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <input
            className="px-3 py-2 h-7 rounded-md text-black w-full lg:w-64"
            placeholder="Søk (tittel/sted)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
            <input
            type="checkbox"
            checked={onlyBusy}
            onChange={(e) => setOnlyBusy(e.target.checked)}
            />
            Bare opptatt
        </label>

        <button
            className="px-3 py-2 rounded-md bg-white/15 hover:bg-white/20 text-sm"
            onClick={() => {
            setQuery("");
            setOnlyBusy(false);
            }}
        >
            Nullstill
        </button>
        </div>
    </div>

    <div className="mt-4 bg-white rounded-md p-2 text-black ">
        <Calendar
        localizer={localizer}
        events={filtered}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day", "agenda"]}
        view={view}
        onView={(v: any) => setView(v)}
        style={{ height: 650 }}
        min={minTime}
        max={maxTime}
        formats={{
            timeGutterFormat: " - HH:mm  - ",
            eventTimeRangeFormat: ({ start, end }, culture, loc) =>
            `${loc?.format(start, "HH:mm", culture)} – ${loc?.format(end, "HH:mm", culture)}`,
            agendaTimeFormat: "HH:mm",
            agendaTimeRangeFormat: ({ start, end }, culture, loc) =>
            `${loc?.format(start, "HH:mm", culture)} – ${loc?.format(end, "HH:mm", culture)}`,
        }}
        messages={{
            next: "Neste",
            previous: "Forrige",
            today: "I dag",
            month: "Måned",
            week: "Uke",
            day: "Dag",
            agenda: "Liste",
            date: "Dato",
            time: "Tid",
            event: "Hendelse",
            noEventsInRange: "Ingen hendelser i dette tidsrommet.",
        }}
        tooltipAccessor={(e: any) =>
            e.location ? `${e.title}\n${e.location}` : e.title
        }
        onSelectEvent={(e: any) => {
            // kan senere åpne modal/side
            console.log("Selected event:", e);
        }}
        />
    </div>
    </div>
);
}
