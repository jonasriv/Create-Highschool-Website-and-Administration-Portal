// src/app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Application from '@/models/application'; // Juster banen til din modell
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import { verifyToken } from '@/app/admin/verifyToken';

const bucketName = process.env.AWS_BUCKET_NAME!;
const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const maxDuration = 60; 

async function analyzeDocument(req: NextRequest, fileKey: string) {
  // Verifiser token med verifyToken funksjonen
  const authResult = verifyToken(req);  // Bruk NextRequest her
  if (authResult.error) {
    throw new Error("Unauthorized: Invalid token");
  }

  const { decoded } = authResult;

  // Sjekk at decoded faktisk er et objekt og inneholder isAdmin
  if (!decoded || typeof decoded !== "object" || !("isAdmin" in decoded)) {
    throw new Error("Token inneholder ikke nødvendig informasjon.");
  }

  if (!decoded.isAdmin) {
    throw new Error("Du har ikke tilgang til denne ressursen");
  }

  try {
    const startCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: fileKey,
        },
      },
    });

    const startResponse = await textract.send(startCommand);
    const jobId = startResponse.JobId;

    if (!jobId) {
      throw new Error("Kunne ikke starte Textract-jobb.");
    }

    // Vent på at Textract-jobben fullføres
    let jobStatus = "IN_PROGRESS";
    let textractResponse = undefined;

    while (jobStatus === "IN_PROGRESS") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Vent 5 sekunder

      const getCommand = new GetDocumentTextDetectionCommand({
        JobId: jobId,
      });

      textractResponse = await textract.send(getCommand);
      jobStatus = textractResponse.JobStatus!;
    }

    if (!textractResponse || jobStatus !== "SUCCEEDED") {
      throw new Error(`Textract-jobb mislyktes eller returnerte ingen data.`);
    }

    // Filtrer blokker for å hente kun tekstlinjer
    const textLines = textractResponse.Blocks?.filter((block) => block.BlockType === "LINE")
                                               .map((block) => block.Text);

    // Hvis du bare vil ha tekstlinjene og ikke metadataene
    return textLines || [];
  } catch (error) {
    console.error("Feil ved Textract-analyse:", error);
    throw new Error("Kunne ikke analysere dokumentet.");
  }
}

// PATCH-metoden for delvis oppdatering
export async function PATCH(req: NextRequest) {
  
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

  const id: string = req.nextUrl.pathname.split('/').pop()!; // Hent 'id' fra URL

  try {
    const updates = await req.json(); // Hent oppdateringer fra forespørselen

    await dbConnect();

    // Hvis forespørselen inneholder en filnøkkel, kjør Textract-analyse
    if (updates.fileKey) {
      try {
        const timeout = new Promise<string[]>((_, reject) =>
        setTimeout(() => reject(new Error("Textract prosessen tok for lang tid.")), 60000)
        );  

        const textractAnalysis = await Promise.race([
          analyzeDocument(req, updates.fileKey),
          timeout,
        ]);
        
        updates.textractAnalysis = JSON.stringify(textractAnalysis);
        delete updates.fileKey;
      } catch (error) {
        console.error(`Textract feilet eller tok for lang tid for søknad ${id}.`, error);
        updates.textractAnalysis = "feilet";
      }
    }  

    try {
      // Oppdater databasen
      const updatedApplication = await Application.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedApplication) {
        return NextResponse.json({ message: "Application not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Application updated", application: updatedApplication });
    } catch (error) {
      console.error("Error updating application:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  } catch (error) {
    console.log("Et eller annet gikk feil", error);
    return NextResponse.json({ message: "Feil ved behandling av forespørsel" }, { status: 500 });
  }
};
