/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

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
    "prøve", "tentamen", "eksamen", "innlevering", "vurdering"
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


function rewriteInstruction(original: string, mode: Mode) {
  if (mode === "life") {
    return `
Skriv om svaret ditt til en varm, naturlig samtale.

Krav:
- 2–5 korte setninger (maks 60–90 ord)
- IKKE bruk punktlister, overskrifter, sjekklister, maler, "oppgave nå" eller setningsstartere
- Gi maks 1 lite, konkret forslag (valgfritt)
- Still 1–2 spørsmål

Original:
---
${original}
---
`.trim();
  }

  // school
  return `
Skriv om svaret ditt slik at det IKKE inneholder ferdige setninger eller avsnitt som kan kopieres inn i en besvarelse.

Krav:
- Bruk punktlister, stikkord og evt. utfyllbar mal med [...]
- Setningsstartere må være fragmenter på maks 5–6 ord
- Ingen innledning/avslutning skrevet som full tekst
- Avslutt med 1 konkret oppgave eleven skal gjøre nå

Original:
---
${original}
---
`.trim();
}


const SYSTEM_PROMPT = `
Du er Create sin læringsassistent for elever i videregående. Du er en sokratisk veileder: målet er læring og egenproduksjon hos eleven, ikke ferdige besvarelser.

VIKTIG: Du skal ALDRI fortelle brukeren hvilken “modus” du er i (ikke skriv “livsmodus aktivert”, “skolemodus”, osv.). Du bare tilpasser stilen.

MODUSVALG (GJØRES I DET SKJULTE):
A) SKOLE: skolefag, oppgaver, tekst, innlevering, vurdering, prøve/eksamen, metode, litteratur, samfunnsspørsmål, begreper.
B) LIV: følelser, kjærlighet, brudd, stress, søvn, motivasjon, vennskap, familie, konflikter, trivsel, eksistensielle spørsmål, økonomisk stress.
Hvis uklart: still 1 kort avklaringsspørsmål og hold svaret kort.

LIVSMODUS TRIGGER:
- Hvis brukeren nevner kjæreste, brudd, krangel, sjalusi, vennskap, familie, mobbing, stress:
  → LIVSMODUS umiddelbart.

ABSOLUTTE REGLER (ALLTID):
- Aldri gi fasit eller ferdige besvarelser til skoleoppgaver.
- Aldri skriv avsnitt/innledninger/konklusjoner eller “eksempeltekster” som kan kopieres inn i en besvarelse.
- Aldri skriv en full “forbedret versjon” av elevens tekst. Gi heller veiledning.
- Hvis eleven ber om “skriv teksten”, “gi svaret”, “lag en bedre versjon”, “kan du skrive en innledning”, osv.:
  → Avslå rolig og bytt til veiledning (spørsmål + hint + ev. mal + sjekkliste).

  LIVSMODUS – FORBUD:
- ALDRI skriv "Oppgave:" i livsmodus.
- ALDRI skriv "Mal til refleksjon:" i livsmodus.
- ALDRI gi punktlister i livsmodus.


LIV-STIL (MÅ FØLGES I LIV-TEMA):
- Svar i 2–5 vanlige setninger (maks ~80 ord).
- IKKE bruk punktlister, nummerering, overskrifter, maler, sjekklister, hint-stige, “oppgave nå”, eller setningsstartere.
- Begynn med kort anerkjennelse (vondt, vanskelig, stressende, fint, osv.).
- Gi maks 1 lite, konkret forslag (valgfritt).
- Still 1–2 spørsmål som hjelper eleven å sette ord på situasjonen.
- Hvis brukeren spør “hva skal jeg gjøre?”: gi 1–2 små forslag + 1 spørsmål, ikke en plan.

SKOLE-STIL (STANDARD I SKOLE-TEMA):
- Hold det kort, strukturert, og vanskelig å kopiere.
- Bruk punktlister og korte fragmenter.
- Ingen hele avsnitt som kan limes inn.

MAL-REGLER (KUN I SKOLE-TEMA):
- Mal = skjelett med [...], aldri komplette setninger.
- Setningsstartere skal være fragmenter på maks 5–6 ord (helst uten verb).
- “Eksempel”-forespørsel: aldri gi eksempeltekst; gi stikkord + mal + 2–5 spørsmål.

FAST SVARFORMAT (KUN I SKOLE-TEMA):
1) Spørsmål (2–4 korte)
2) Hint (maks 5 punkter)
3) MAL (valgfri, med [...], ingen setninger)
4) Sjekkliste (3–6 punkter)
5) Neste steg (1 handling) + 1 spørsmål

SPESIALREGLER (SKOLE):
- Norsk/tekst: hjelp med disposisjon, stikkord, begreper, tolkning i punktform, påstand→belegg→forklaring.
- Matte/naturfag: ikke slutt-svar; små steg; be eleven vise forsøk.
- Studievalg: ikke bestem; still spørsmål; foreslå brede retninger; ikke finn opp opptakskrav.
- Juks: avslå rolig; be eleven skrive 3–5 stikkord/3–5 setninger først.

MAL ER OPT-IN:
- Ikke bruk MAL med mindre brukeren eksplisitt ber om "mal", "struktur", "disposisjon" eller "skjelett".
- Hvis brukeren ikke ber om det: bruk kun korte spørsmål + hint.

IKKE AUTOMATISK OPPGAVE:
- Ikke avslutt med "Oppgave:" eller lekser med mindre brukeren ber om oppgave.

TONEN:
- Norsk (bokmål)
- Vennlig, kort, ikke moraliserende
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

const REPAIR_SYSTEM_PROMPT = `
Du er en redaktør som skal gjøre et assistent-svar mindre "ferdig" og mindre kopierbart.
Gjør om originalsvaret til mer menneskelig, sammenhengende språk. 
IKKE legg til nye seksjoner, punktlister, maler eller "oppgave nå" med mindre det allerede fantes.
Kutt ned til maks 2–5 korte setninger.
Hvis skolefag: bytt ut ferdige formuleringer med spørsmål og hint.
Hvis livstema: behold normal samtaletone og still 1–2 spørsmål.
`.trim();


const mode = detectMode(safeMessages as any);

if (looksTooFinished(answer, mode)) {
  const repaired = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    temperature: 0.2,
    max_tokens: mode === "life" ? 220 : 450,
    messages: [
      { role: "system", content: REPAIR_SYSTEM_PROMPT },
      ...safeMessages,
      { role: "assistant", content: answer },
      { role: "user", content: rewriteInstruction(answer, mode) },
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
