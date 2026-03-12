import { NextRequest, NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "Mangler url" }, { status: 400 });

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ElevHub/1.0)",
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8",
            },
            next: { revalidate: 300 },
        });

        if (!res.ok) return NextResponse.json({ error: `Kunne ikke hente siden (${res.status})` }, { status: 502 });

        const html = await res.text();
        const { document } = parseHTML(html, { url });

        const reader = new Readability(document as unknown as Document);
        const article = reader.parse();

        if (!article) return NextResponse.json({ error: "Kunne ikke tolke artikkelen" }, { status: 422 });

        return NextResponse.json({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            byline: article.byline,
        });
    } catch (e) {
        console.error("getContent feil:", e);
        return NextResponse.json({ error: "Noe gikk galt" }, { status: 500 });
    }
}
