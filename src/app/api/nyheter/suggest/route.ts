/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export const runtime = "nodejs";

type Feed = { name: string; url: string };

async function fetchWithTimeout(url: string, ms: number) {
const controller = new AbortController();
const t = setTimeout(() => controller.abort(), ms);

try {
    const r = await fetch(url, {
    signal: controller.signal,
    headers: { Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8" },
    next: { revalidate: 60 * 5 },
    });
    return r;
} finally {
    clearTimeout(t);
}
}


const FEEDS: Feed[] = [
// NRK
{ name: "NRK Toppsaker", url: "https://www.nrk.no/toppsaker.rss" },
{ name: "NRK Siste", url: "https://www.nrk.no/nyheter/siste.rss" },
{ name: "NRK Innenriks", url: "https://www.nrk.no/norge/toppsaker.rss" },

// Forskning
{ name: "forskning.no", url: "https://www.forskning.no/rss" },

// TU
{ name: "Teknisk Ukeblad", url: "https://www.tu.no/rss/" },

// SSB
{ name: "SSB", url: "https://www.ssb.no/rss/" },
];

type NewsSuggestion = {
source: "news";
provider: string;
title: string;
permalink: string;
snippet?: string;
publishedAt?: string; // ISO
first_image_url?: string;
};

function toArray<T>(x: T | T[] | undefined | null): T[] {
if (!x) return [];
return Array.isArray(x) ? x : [x];
}

function stripTags(html: string) {
return String(html ?? "").replace(/<[^>]*>/g, "");
}

function parseDate(d: any): number {
const s = String(d ?? "");
const t = Date.parse(s);
return Number.isFinite(t) ? t : 0;
}

function tokenize(q: string) {
return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function matchesQuery(item: { title?: string; snippet?: string }, tokens: string[]) {
if (tokens.length === 0) return true;
const hay = `${item.title ?? ""} ${item.snippet ?? ""}`.toLowerCase();
// “any-token” match (mer tilgivende og føles bedre i søkefelt)
return tokens.some((t) => hay.includes(t));
}

export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
const q = (searchParams.get("q") || "").trim();

if (q.length < 3) return NextResponse.json({ suggestions: [] });

const tokens = tokenize(q);

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    // RSS varierer litt, denne er robust i praksis:
    removeNSPrefix: true,
});

const fetched = await Promise.allSettled(
FEEDS.map(async (f) => {
    const r = await fetchWithTimeout(f.url, 2500); // 2.5s per feed
    if (!r.ok) throw new Error(`Feed failed: ${f.name} (${r.status})`);
    const xml = await r.text();
    return { feed: f, xml };
})
);


const allItems: NewsSuggestion[] = [];

for (const res of fetched) {
    if (res.status !== "fulfilled") continue;

    const { feed, xml } = res.value;

    let parsed: any;
    try {
    parsed = parser.parse(xml);
    } catch {
    continue;
    }

    const channel = parsed?.rss?.channel ?? parsed?.feed ?? parsed?.channel;
    const items = toArray(channel?.item ?? channel?.entry);

    for (const it of items) {
    const title = stripTags(it?.title?.["#text"] ?? it?.title ?? "");
    const link =
        it?.link?.["@_href"] ??
        it?.link?.href ??
        it?.link ??
        it?.guid ??
        "";

    const snippet = stripTags(
        it?.description ??
        it?.summary?.["#text"] ??
        it?.summary ??
        it?.content?.["#text"] ??
        it?.content ??
        ""
    );

    // RSS pubDate, Atom updated/published
    const pub = it?.pubDate ?? it?.published ?? it?.updated ?? it?.dcdate;
    const publishedAt = parseDate(pub);

    // Enclosure / media thumbnail (best effort)
    const enclosureUrl =
        it?.enclosure?.["@_url"] ??
        it?.thumbnail?.["@_url"] ??
        it?.content?.["@_url"];

    if (!title || !link) continue;

    const s: NewsSuggestion = {
        source: "news",
        provider: feed.name,
        title,
        permalink: String(link),
        snippet: snippet || undefined,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        first_image_url: enclosureUrl ? String(enclosureUrl) : undefined,
    };

    if (matchesQuery(s, tokens)) allItems.push(s);
    }
}

// dedupe på lenke + sorter nyeste først
const seen = new Set<string>();
const deduped = allItems
    .filter((x) => {
    const k = x.permalink.trim();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
    })
    .sort((a, b) => (Date.parse(b.publishedAt ?? "") || 0) - (Date.parse(a.publishedAt ?? "") || 0))
    .slice(0, 8);

return NextResponse.json({ suggestions: deduped });
}
