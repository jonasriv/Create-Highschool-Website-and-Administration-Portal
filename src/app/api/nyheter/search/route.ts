// app/api/nyheter/search/route.ts
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 3) return Response.json({ suggestions: [] });

    const res = await fetch(
        `https://content.guardianapis.com/search?q=${encodeURIComponent(q)}&lang=en&page-size=10&show-fields=thumbnail,trailText,byline&api-key=${process.env.GUARDIAN_API_KEY}`,
        { next: { revalidate: 60 * 5 } }
    );

    const data = await res.json();

    const suggestions = data.response.results.map((x: any) => ({
        title: x.webTitle,
        permalink: x.webUrl,
        snippet: x.fields?.trailText,
        first_image_url: x.fields?.thumbnail,
        provider: "The Guardian",
        publishedAt: x.webPublicationDate,
        guardian_id: x.id,
    }));

    return Response.json({ suggestions });
}