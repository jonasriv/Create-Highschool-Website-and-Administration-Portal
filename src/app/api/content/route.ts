import dbConnect from "@/lib/mongoose";
import Content from "@/models/content";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/admin/verifyToken";

export async function POST(req: NextRequest) {
  
  const authResult = verifyToken(req);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { decoded } = authResult;
  // Sjekk at decoded faktisk er et objekt og inneholder isAdmin
  if (!decoded || typeof decoded !== "object" || !("isAdmin" in decoded)) {
    return NextResponse.json({ error: "Token inneholder ikke nødvendig informasjon." }, { status: 403 });
  }

  if (!decoded.isAdmin) {
    return NextResponse.json({error: "Du har ikke tilgang til denne ressursen."}, { status: 403 });
  };

  try {
    // Parse forespørselen som JSON
    const formData = await req.formData();
    console.log("FormData keys:", [...formData.keys()]);
    console.log("soknad_intro:", formData.get("soknad_intro"));
    const frontpage_title = formData.get("frontpage_title") as string;
    const frontpage_soknadsfrist = formData.get("frontpage_soknadsfrist") as string;
    const elev_1 = formData.get("elev_1") as string;
    const elev_2 = formData.get("elev_2") as string;
    const elev_3 = formData.get("elev_3") as string;
    const elev_4 = formData.get("elev_4") as string;
    const program_musikk = formData.get("program_musikk") as string;
    const program_dans = formData.get("program_dans") as string;
    const program_drama = formData.get("program_drama") as string;
    const opptak = formData.get("opptak") as string;
    const hva_blir_jeg = formData.get("hva_blir_jeg") as string;
    const om_create = formData.get("om_create") as string;
    const soknad_intro = formData.get("soknad_intro") as string;

    // Koble til databasen
    await dbConnect();

    // Opprett en ny søknad
    const newContent = await Content.create({
        frontpage_title,
        frontpage_soknadsfrist,
        elev_1,
        elev_2,
        elev_3,
        elev_4,
        program_musikk,
        program_dans,
        program_drama,
        opptak,
        hva_blir_jeg,
        om_create,
        soknad_intro,
    });
    console.log("Lagret innhold fra databasen:", newContent);
    // Returner en vellykket respons
    return NextResponse.json(
      {
        message: "Innholdet ble oppdatert!",
        data: newContent,
        
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke oppdatere innhold." },
      { status: 500 }
    );
  }
}

export async function GET() {

  try {
    // Koble til databasen
    await dbConnect();

    // Hent alle søknadene
    const content = await Content.find({});

    // Returner søknadene som en JSON-respons
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente innhold." },
      { status: 500 }
    );
  }
}

