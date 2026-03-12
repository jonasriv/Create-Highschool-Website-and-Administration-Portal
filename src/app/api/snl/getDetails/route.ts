import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if(!url) {
        return NextResponse.json({ message: "NO URL"}, { status: 400 });
    }

    const res = await fetch(`${url}.json`, {
        next: {revalidate: 60 * 60 },
    });

    if (!res.ok) {
        return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
        xhtml_body: data?.xhtml_body ?? null,
        authors: data?.authors ?? null,
        changed_at: data?.changed_at ?? null,
    });
}