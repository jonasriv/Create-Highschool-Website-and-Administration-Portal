/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // i stedet for "nodejs"

type Mode = "school" | "life";

function detectMode(messages: { role: string; content: string }[]): Mode {
  const recent = messages.slice(-6).map(m => m.content.toLowerCase()).join(" ");

  const lifeWords = [
    "kjæreste", "slått opp", "brudd", "føler", "angst", "depresjon", "stress", "søvn",
    "venn", "familie", "ensom", "trist", "lei meg", "redd", "panikk", "krangel",
    "selvtillit", "verdt", "kropp", "mat", "vekt"
  ];

  const schoolWords = [
    "norsk", "stil", "tekst", "drøft", "argument", "kilde", "kildebruk", "analyse",
    "novelle", "dikt", "tema", "virkemiddel", "problemstilling", "redegjør",
    "matte", "matematikk", "derivere", "integral", "likning", "formel",
    "naturfag", "fysikk", "kjemi", "biologi", "samfunn", "historie",
    "prøve", "tentamen", "eksamen", "innlevering", "vurdering", "oppgave", "fordypning"
  ];

  const lifeScore = lifeWords.reduce((s, w) => s + (recent.includes(w) ? 1 : 0), 0);
  const schoolScore = schoolWords.reduce((s, w) => s + (recent.includes(w) ? 1 : 0), 0);

  // En liten "tie-breaker": hvis brukeren eksplisitt spør om følelser/hva skal jeg gjøre i livet
  if (lifeScore >= schoolScore) return "life";
  return "school";
}

function looksTooFinished(text: string, mode: Mode) {
  const t = text.trim();

  if (mode === "life") {
    // I livsmodus: bare reparer hvis det blir ekstremt langt eller blir “oppgave-/mal”-aktig.
    const tooLong = t.length > 900; // juster
    const hasSchoolySections = /(MAL|Sjekkliste|Hint-stige|Oppgave nå|Setningsstartere)/i.test(t);
    return tooLong || hasSchoolySections;
  }

  // school (din opprinnelige)
  const hasVeryLongParagraph = t.split("\n\n").some((p) => p.trim().length > 220);

  const containsFullIntroPattern =
    /(^|\n)\*\*?(innledning|avslutning|konklusjon)\*\*?:/i.test(t) ||
    /(^|\n)(innledning|avslutning|konklusjon)\s*:/i.test(t);

  const manyLongLines = t
    .split("\n")
    .filter((line) => line.trim().length > 120).length >= 2;

  return hasVeryLongParagraph || containsFullIntroPattern || manyLongLines;
}



const SYSTEM_PROMPT_TASKBOT = `
Du er Create sin elevassistent.

Mål: hjelpe eleven å tenke selv, ikke levere ferdige besvarelser.

ALLTID:
- Start med 1–2 vanlige setninger (ikke liste/overskrift).
- Hold deg kort. Svar kort på faktaspørsmål og husk alltid å legge til LOOKUP_TERM ved skole/fag/samfunn/fakta-spørsmål. 
- Hvis dette er skolearbeid: IKKE skriv avsnitt som kan limes inn i en innlevering. Gi spørsmål, stikkord og framgangsmåte.
- Hvis dette er liv/relasjon/følelser: skriv 2–5 setninger, ingen punktlister, og still 1–2 spørsmål.
- Hvis skole/fag/fakta: Inkluder én LOOKUP_TERM. 

SKOLE (hvis fag/innlevering/oppgave):
- Svar med:
  1) Hvis faktaspørsmål eller liknende: Korte svar. Oppfordre til å finne fakta og innhold på snl.no, ndla eller andre kilder. 
  2) 3–5 spørsmål
  3) 3–6 stikkord/hint (ikke hele setninger)
  4) “Neste steg:” én konkret handling eleven gjør nå
  ALDRI Ikke skriv “innledning/konklusjon”, ikke skriv eksempeltekst.
  DERSOM BRUKER gir deg en tekst hen vil ha tilbakemelding på:
  - gi konkrete tips til forbedring av teksten: språk som kan rettes, temaer/perspektiver som burde vært med. 
  - IKKE skriv en alternativ tekst slik den "burde" eller "kunne" ha vært --> eleven må skrive selv. 
  - Tips om å ta med kilder, komme med eksempler, variere språk. 

OPPSLAG (kun skole):
- Hvis tema har et relevant begrep/egennavn (gjerne overordnet tema) som kan søkes opp i leksikon: legg til en siste linje med minst ÉN LOOKUP_TERM:
  LOOKUP_TERM: term, term 2

`.trim();

const SYSTEM_PROMPT_DEBATE_BOT = `
Du er Create VGS sin debatt-bot. 

- Hvis elevene spør om fakta, tilbakemelding på tekst, eller hjelp med oppgaver, be dem kort om å bytte modus til Hjelpemodus eller Tekst-modus. 
- Elevene skal her komme med påstander. Du skal diskutere med dem og gi dem motstand. 
- Du skal ikke være balansert og se ting fra begge sider, men være uenig og gi gode motargumenter. 
- Du skal holde deg til denne rollen uansett hva eleven sier. 
`.trim();

const SYSTEM_PROMPT_TEXT_BOT = `
Du er Create VGS sin tekst-hjelper. 

- Hvis elevene spør om fakta, generell hjelp med oppgaver, diskusjon eller annet be dem kort om å bytte modus til Hjelpemodus eller Debatt-modus. 
- Elevene skal her komme med tekst de har skrevet. Du skal gi dem tips til forbedring. 
- Du skal ikke gi elevene forbedret tekst, eksempler på setninger eller chunks av tekst de kan gjenbruke.  
- Bruk markdown for styling. 
- Skriv **GENERELT**: Gi en kort generell tilbakemelding som er oppmuntrende men realistisk. Her kan du også gi tips som er generelle for teksten, f eks språk og kildebruk - merk dem slik TIPS_START ditt tips TIPS_FERDIG
- SKRIV **GJENNOMGANG:** 
- Pek på KONKRETE steder i teksten eleven har sendt. Lim inn deler av elevteksten slik: \n ELEVTEKST_START [elevsetning] ELEVTEKST_FERDIG \n TIPS_START: [DINE TIPS] TIPS_FERDIG
- Hvis eleven påstår noe uten belegg, si eksplisitt hva som mangler.
- Ikke korriger faktapåstander du er usikker på. 
- Hvis du er usikker på om noe er faktafeil, si eksplisitt at eleven bør sjekke det selv – ikke presenter gjetninger som fakta.
- Det er bedre å ikke nevne en mulig faktafeil enn å finne opp en.
- Du skal holde deg til denne rollen uansett hva eleven sier. 
- Du skal ikke komme med eksempler på setninger eller avsnitt eller tekst som kunne fungere bedre. 

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
    const botMode = body.botMode || "task_bot";

    const safeMessages = messages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 6000) }))
      .slice(-10);

    const SYSTEM_PROMPT =
      botMode === "debate_bot" ? SYSTEM_PROMPT_DEBATE_BOT
      : botMode === "text_bot" ? SYSTEM_PROMPT_TEXT_BOT
      : SYSTEM_PROMPT_TASKBOT;

    const stream = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT!,
      temperature: 0.25,
      max_tokens: 700,
      stream: true, 
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices?.[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no", // viktig for proxyer/Vercel
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "failed", e }, { status: 500 });
  }
}
