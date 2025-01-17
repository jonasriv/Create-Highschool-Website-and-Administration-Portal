import dbConnect from "@/lib/mongoose";
import News from "@/models/news";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    
  try {
    // Parse forespørselen som JSON
    const { news_title, news_content, news_image } = await req.json();

    if (!news_title || !news_content || !news_image) {
        return NextResponse.json(
            { error: "Alle feltene er påkrevd." },
            { status: 400 }
        );
    }
 
    // Koble til databasen
    await dbConnect();

    // Opprett en ny søknad
    const newNewsItem = await News.create({
      news_title,
      news_content,
      news_image,

    });
    
    // Returner en vellykket respons
    return NextResponse.json(
      {
        message: "Søknaden ble sendt inn!",
        application: newNewsItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke lagre nyheten." },
      { status: 500 }
    );
  }
}

// GET: Hent søknader 
export async function GET() {
    try {
      // Kontrollerer at tilkoblingen til databasen skjer riktig
      await dbConnect();
  
      // Henter alle nyheter fra News-modellen
      const newsItems = await News.find({});
      
      console.log("Fetched News Items:", newsItems); // Legg til logg for å sjekke hva som hentes
  
      // Hvis ingen nyheter finnes, returner passende melding
      if (!newsItems || newsItems.length === 0) {
          return NextResponse.json(
              { message: "Ingen nyheter funnet." },
              { status: 404 }
          );
      }
  
      // Returner nyheter hvis de finnes
      return NextResponse.json({ news: newsItems });
  
    } catch (error) {
      // Feil ved tilkobling eller henting av nyheter
      console.error("Error:", error);
      return NextResponse.json({ error: "Kunne ikke hente nyheter." }, { status: 500 });
    }
  }
  
