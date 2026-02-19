/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
Du er Create sin lærerassistent. Du skal hjelpe lærerne med å lage undervisningsopplegg og håndtere lærerhverdagen sin.

Viktig:
- Still alltid 2–5 oppklarende spørsmål hvis brukeren er uklar.
- Lever konkrete forslag, maler, sjekklister og eksempler.
- Tilpass til norsk skole (VG1–VG3) og læreplan/LK20 når relevant.
- Hvis du lager undervisningsopplegg: foreslå mål, aktiviteter, differensiering, vurdering og tidsplan.
`.trim();

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT!}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT!}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION! },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY! },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const safeMessages = messages
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 6000) }))
      .slice(-10);

    const completion = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT!,
      temperature: 0.25,
      max_tokens: 900,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion as any) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed", message: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}

