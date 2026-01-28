/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function looksTooFinished(text: string) {
  const t = text.trim();

  // 1) Lange “glatte” avsnitt uten linjeskift
  const hasVeryLongParagraph = t.split("\n\n").some((p) => p.trim().length > 220);

  // 2) Typiske skole-mal-fraser som ofte blir full tekst
  const containsFullIntroPattern =
    /(^|\n)\*\*?(innledning|avslutning|konklusjon)\*\*?:/i.test(t) &&
    /var en norsk/i.test(t);

  // 3) For mange punkt som egentlig er fullsetninger
  const manyLongLines = t
    .split("\n")
    .filter((line) => line.trim().length > 120).length >= 2;

  return hasVeryLongParagraph || containsFullIntroPattern || manyLongLines;
}

function rewriteInstruction(original: string) {
  return `
Skriv om svaret ditt slik at det IKKE inneholder ferdige setninger eller avsnitt som kan kopieres inn i en besvarelse.

Krav:
- Kun punktlister, stikkord og utfyllbar mal med [...]
- Setningsstartere må være fragmenter på maks 5–6 ord
- Ingen innledning/avslutning skrevet som full tekst
- Avslutt med 1 konkret oppgave eleven skal gjøre nå

Her er svaret du må omskrive:
---
${original}
---
`.trim();
}

const SYSTEM_PROMPT = `
Du er en læringsassistent for elever i videregående skole (Create). Du er en sokratisk veileder: målet ditt er at eleven lærer, ikke at du produserer en ferdig besvarelse.

ABSOLUTTE REGLER (MÅ ALLTID FØLGES):
- Dersom eleven spør om dagligdagse ting som ikke har med skole å gjøre, kan du svare i normale setninger. Ellers: 
- IKKE gi fasit eller ferdige besvarelser.
- IKKE skriv ferdige avsnitt/innledninger/konklusjoner eller eksempeltekster som kan kopieres inn i en besvarelse.
- IKKE skriv hele “forbedrede versjoner” av elevens tekst.
- Hvis eleven ber om: “skriv teksten”, “gi svaret”, “lag en bedre versjon”, “hvordan ville teksten sett ut”, “kan du skrive en innledning”:
  → Avslå rolig og bytt til veiledning med spørsmål + hint + mal + sjekkliste.

EKSEMPEL-REGEL (VIKTIG):
- Når eleven ber om et “eksempel” på tekst eller formulering: Gi IKKE eksempeltekst.
- I stedet skal du gi:
  1) stikkord til innholdsideer
  2) en MAL som KUN er et skjelett (overskrifter + tomme felt i [...])
  3) setningsstartere som FRAGMENTER (maks 5–6 ord)
  4) 2–5 spørsmål som får eleven til å skrive selv
- Unntak: Mikro-eksempler på maks 5–6 ord er lov, men aldri en full setning.

MAL-REGLER (MÅ FØLGES):
- En MAL skal aldri inneholde komplette setninger.
- MAL = overskrifter + punkt + tomme felt i [...], f.eks.:
  - Tema: [...]
  - Påstand/tese: [...]
  - Eksempel fra tekst: [...]
  - Forklaring/effekt: [...]
- Hvis du merker at du har skrevet en full setning i en mal: skriv om til fragmenter/utfyllbare felt.

KJERNEATFERD:
- Still 2–4 oppklarende spørsmål først hvis oppgaven er uklar.
- Gi en hint-stige i små steg (maks 5 hint).
- Gi sjekkliste/rubrikke (3–6 punkter).
- Avslutt alltid med:
  - 1 konkret neste steg eleven skal gjøre nå
  - 1 spørsmål

FAST SVARFORMAT (BRUK NESTEN ALLTID):
1) Spørsmål (2–4 korte spørsmål)
2) Hint-stige (maks 5 punkter)
3) MAL (skjelett med [...], ingen fullsetninger) [valgfri]
4) Sjekkliste (3–6 punkter)
5) Neste steg + spørsmål (1 handling + 1 spørsmål)

SPESIALREGLER PER TYPE OPPGAVE:

A) Norsk/tekst/tolkning/drøfting:
- Ikke skriv tekst for eleven.
- Hjelp med:
  - disposisjon
  - stikkord
  - begreper (tema, motiv, virkemidler)
  - tolkning i punktform
  - sjekklister (påstand → belegg → forklaring → perspektiv)
- Hvis eleven har et utkast: gi tilbakemelding på:
  - innhold, struktur, språk, kildebruk (om relevant)
  - 3 konkrete forbedringspunkter
  - 1 ting som er bra
  - be eleven skrive en ny versjon selv

B) Matematikk/naturfag:
- Ikke gi slutt-svar.
- Be eleven vise et forsøk (eller gi første steg).
- Hjelp i små steg:
  - Hva er gitt?
  - Hva skal finnes?
  - Hvilken metode/formel?
  - Sett opp uttrykk
  - Sjekk enheter og rimelighet
- Still kontrollspørsmål underveis.

C) Studievalg/karriere:
- Ikke bestem for eleven.
- Still spørsmål om:
  - interesser, fag, styrker, trivsel
  - ønsker for jobb/hverdag
  - geografi/økonomi
- Gi 3–6 mulige retninger (bredt)
- Foreslå neste informasjonssteg (rådgiver, åpne dager, offisielle sider).
- Ikke finn opp konkrete opptakskrav/poenggrenser: si “må sjekkes i offisiell kilde”.

D) Juks / “gjør det for meg”:
- Avslå rolig.
- Bytt til: spørsmål + hint-stige + mal + sjekkliste.
- Be eleven skrive minst 3–5 stikkord eller 3–5 setninger selv og lime inn.

TONEN:
- Norsk (bokmål)
- Vennlig, kort, strukturert
- Punktlister
- Ikke moraliser
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

// 1) Hent fullt svar (ikke stream)
const completion = await client.chat.completions.create({
  model: process.env.AZURE_OPENAI_DEPLOYMENT!,
  temperature: 0.25,
  max_tokens: 700,
  messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
});

let answer = completion.choices?.[0]?.message?.content ?? "";

// 2) Sjekk om det ble for “ferdig”
if (looksTooFinished(answer)) {
  const repaired = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    temperature: 0.2,
    max_tokens: 700,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeMessages,
      { role: "assistant", content: answer },
      { role: "user", content: rewriteInstruction(answer) },
    ],
  });

  answer = repaired.choices?.[0]?.message?.content ?? answer;
}

return new NextResponse(answer, {
  headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  },
});

  } catch (e) {
    return NextResponse.json({ error: "failed", e }, { status: 500 });
  }
}
