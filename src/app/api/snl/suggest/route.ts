/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  

  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const url = `https://snl.no/api/v1/search?query=${encodeURIComponent(q)}&limit=8&offset=0`;

  const r = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 5 }, // cache 5 min
  });

  if (!r.ok) {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }

  const data = await r.json();
  
  const results = data;
  // console.log("RAW RESULT: ", results);
  const suggestions = results
    .map((x: any) => ({
      headword: x?.headword,
      permalink: x?.permalink,
      clarification: x?.clarification,
      rank: x?.rank,
      snippet: x?.snippet,
      taxonomy_id: x?.taxonomy_id,
      licence: x?.licence,
      title: x?.title,
      first_image_url: x?.first_image_url,
      first_image_licence: x?.first_image_licence,     
      article_url: x?.article_url,      
    }))
    .filter((s: any) => s.title);
    
  return NextResponse.json({ suggestions });
}
