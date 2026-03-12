import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

    const res = await fetch(
        `https://content.guardianapis.com/${id}?show-fields=body,byline,thumbnail&api-key=${process.env.GUARDIAN_API_KEY}`,
        { next: { revalidate: 300 } }
    );

    if (!res.ok) return NextResponse.json({ error: `Guardian svarte ${res.status}` }, { status: 502 });

    const data = await res.json();
    const article = data?.response?.content;

    if (!article) return NextResponse.json({ error: "Ingen artikkel" }, { status: 422 });

    return NextResponse.json({
        title: article.webTitle,
        content: article.fields?.body ?? "",
        byline: article.fields?.byline ?? "",
    });
}
