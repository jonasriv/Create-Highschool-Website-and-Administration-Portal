import dbConnect from "@/lib/mongoose";
import Application from "@/models/application";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";


const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function analyzeDocument(bucketName: string, fileKey: string) {
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


// Konfigurer S3-klienten
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const generatePresignedUrl = async (bucketName: string, fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 time
};
export const maxDuration = 60; // Sett maksimal varighet til 60 sekunder

export async function POST(req: Request) {
    
  try {
    // Parse forespørselen som JSON
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const emailParent = formData.get("emailParent") as string;
    const phone = formData.get("phone") as string;
    const priority1 = formData.get("priority1") as string;
    const priority2 = formData.get("priority2") as string;
    const priority3 = formData.get("priority3") as string;
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Filen mangler." },
        { status: 400 }
      );
    }

    // Generer en unik filnavn for opplastingen
    const filename = `${Date.now()}-${file.name}`;

    // Last opp filen til S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      Body: file.stream(),
      ContentType: file.type,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    })

    const uploadResult = await upload.done();
    console.log("Fil lastet opp til S3:", uploadResult);

    const fileUrl = filename;

    const timeout = new Promise<string[]>((_, reject) =>
      setTimeout(() => reject(new Error("Textract prosessen tok for lang tid.")), 50000)
    );

    // Kjør Textract-analyse
    let textractAnalysis: string | null = null;
    try {
      const textractData = await Promise.race([
        analyzeDocument(process.env.AWS_BUCKET_NAME!, filename),
        timeout,
      ]);
      textractAnalysis = JSON.stringify(textractData);
    } catch (error) {
      console.error("Textract feilet eller tok for lang tid:", error);
      textractAnalysis = null; // Håndter feil uten å avbryte hele prosessen
    }

    const behandlet: number = 0;
    
    // Koble til databasen
    await dbConnect();

    // Opprett en ny søknad
    const newApplication = await Application.create({
      name,
      email,
      emailParent,
      phone,
      priority1,
      priority2,
      priority3,
      filename: fileUrl, // Lagre S3-URL i databasen
      textractAnalysis,  // Lagre Textract-resultatet (kan være null hvis analysen feiler)
      behandlet,  //setter status til ubehandlet
    });
    
    // Returner en vellykket respons
    return NextResponse.json(
      {
        message: "Søknaden ble sendt inn!",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke sende inn søknaden." },
      { status: 500 }
    );
  }
}

// GET: Hent søknader og generer presigned URL-er
export async function GET() {
  try {
    await dbConnect();

    const applications = await Application.find({});
    const applicationsWithUrls = await Promise.all(
      applications.map(async (app) => {
        const filename = app.filename;
        let presignedUrl = null;

        if (filename) {
          try {
            // Sørg for at filnavnet er gyldig før du prøver å generere en presigned URL
            const fileNameWithoutPath = filename.split("/").pop();
            if (fileNameWithoutPath) {
              presignedUrl = await generatePresignedUrl(process.env.AWS_BUCKET_NAME!, fileNameWithoutPath);
            } else {
              console.error("Ugyldig filbane for søknaden:", filename);
            }
          } catch (error) {
            console.error("Feil ved generering av presigned URL:", error);
          }
        } else {
          console.error("Filnavn mangler for applikasjonen:", app);
        }

        return { ...app.toObject(), s3FileUrl: presignedUrl };
      })
    );

    return NextResponse.json({ applications: applicationsWithUrls });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Kunne ikke hente søknadene." }, { status: 500 });
  }
}
