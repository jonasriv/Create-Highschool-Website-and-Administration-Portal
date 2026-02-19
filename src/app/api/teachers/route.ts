import dbConnect from "@/lib/mongoose";
import { TeacherModel } from "@/models/Teacher";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/admin/verifyToken";

export async function POST(req: NextRequest) {
  const authResult = await verifyToken(req);
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

    const { email, displayName, addedByEmail, notes } = await req.json();

    if (!email || !displayName ) {
        return NextResponse.json(
            { error: "Mangler navn eller epost." },
            { status: 400 }
        );
    }
 
    await dbConnect();

    const newTeacher = await TeacherModel.create({
      email,
      displayName,
      addedByEmail,
      notes,

    });
    
    return NextResponse.json(
      {
        message: "Lærereren ble registrert!",
        application: newTeacher,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke registrere lærer." },
      { status: 500 }
    );
  }
}

// GET: Hent lærere 
export async function GET() {
    
  try {
      await dbConnect();
  
      const teacherItems = await TeacherModel.find({});
    
      if (!teacherItems || teacherItems.length === 0) {
          return NextResponse.json(
              { message: "Ingen lærere funnet." },
              { status: 404 }
          );
      }
      return NextResponse.json({ teachers: teacherItems });
  
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: "Kunne ikke hente lærere." }, { status: 500 });
    }
  }
  
export async function DELETE(req: NextRequest) {
  const authResult = await verifyToken(req);
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
        const { deletingId } = await req.json();
        await TeacherModel.deleteOne({ _id: deletingId });
        return NextResponse.json(
            { message: "Teacher deleted" }, 
            { status: 200 }
        );
    }   catch (error) {
        console.error("Error deleting teacher: ", error);
        return NextResponse.json(
            {error: "internal server error"},
            {status: 500}
        )
    }

}
  