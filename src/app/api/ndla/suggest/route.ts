/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

function pickLang(v: any, preferred = "nb") {
  if (!v) return "";
  if (typeof v === "string") return v;

  // prøv ønsket språk først
  if (v[preferred]) return v[preferred];

  // fallback
  if (v.nb) return v.nb;
  if (v.nn) return v.nn;
  if (v.en) return v.en;

  // hvis NDLA plutselig gir noe annet
  const first = Object.values(v)[0];
  return typeof first === "string" ? first : "";
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  
  if (q.length < 3) return NextResponse.json({ suggestions: [] });

  const suggestions = await searchNDLA(q);
  return NextResponse.json({ suggestions})
}

async function searchNDLA(q: string) {
  const url = `https://api.ndla.no/search-api/v1/search?query=${encodeURIComponent(q)}&page=1&page-size=3`;

  const r = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 5 },
  });

  if (!r.ok) return [];

  const data = await r.json();
  const hits = data?.results ?? data?.hits ?? data?.items ?? [];

  return (hits || []).slice(0, 3).map((x: any) => {
    const ctxUrl =
      x?.contexts?.find((c: any) => c?.isPrimary && c?.url)?.url ??
      x?.contexts?.find((c: any) => c?.url)?.url ??
      x?.context?.url ??
      null;

    const permalink =
      typeof ctxUrl === "string"
        ? ctxUrl.startsWith("http")
          ? ctxUrl
          : ctxUrl.startsWith("/")
          ? `https://ndla.no${ctxUrl}`
          : ctxUrl
        : // fallback hvis contexts mangler: bruk API-url (funker, men ikke "publisher")
          x?.url ?? "";

    return {
      source: "ndla" as const,
      title: pickLang(x?.title),
      snippet: pickLang(x?.metaDescription),
      permalink,
      id: x?.id,
      contentType: x?.resultType,
      licence: x?.license,
      first_image_url: x?.metaImage?.url,
    };
  }).filter((s: any) => s.title && s.permalink);
}
