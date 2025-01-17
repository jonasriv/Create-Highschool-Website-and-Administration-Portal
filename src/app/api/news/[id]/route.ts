import dbConnect from "@/lib/mongoose";
import News from "@/models/news";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
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
