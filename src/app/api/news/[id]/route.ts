import dbConnect from "@/lib/mongoose";
import News from "@/models/news";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/admin/verifyToken";

export async function DELETE(req: NextRequest) {
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
    const id: string = req.nextUrl.pathname.split('/').pop()!;  // Hent 'id' fra URL-en

    try {
        // Koble til databasen
        await dbConnect();

        // Finn og slett nyheten med ID
        const deletedNewsItem = await News.findByIdAndDelete(id);

        if (!deletedNewsItem) {
            return NextResponse.json({ message: "Nyheten ble ikke funnet." }, { status: 404 });
        }

        return NextResponse.json({ message: "Nyheten ble slettet." }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Kunne ikke slette nyheten." }, { status: 500 });
    }
}
