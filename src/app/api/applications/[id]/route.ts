// src/app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Application from '@/models/application'; // Juster banen til din modell
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

const bucketName = process.env.AWS_BUCKET_NAME!;
const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const maxDuration = 45; // Sett maksimal varighet til 60 sekunder

async function analyzeDocument(fileKey: string) {
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
          analyzeDocument(updates.fileKey),
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
