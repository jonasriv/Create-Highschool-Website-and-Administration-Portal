// app/api/ndla/getDetails/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const res = await fetch(url, {
        headers: { Accept: "text/html", "Accept-Language": "nb" },
        next: { revalidate: 60 * 60 },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: 500 });

    const html = await res.text();

    // Hent innhold fra ndla-article-seksjonen
    const match = html.match(/<section[^>]*class="[^"]*ndla-article[^"]*"[^>]*>([\s\S]*?)<\/section>/);
    const content = match?.[1] ?? null;

    return NextResponse.json({ content });
}