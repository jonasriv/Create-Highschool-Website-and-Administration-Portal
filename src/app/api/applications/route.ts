import dbConnect from "@/lib/mongoose";
import Application from "@/models/application";
import { NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Konfigurer S3-klienten
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
    
  try {
    // Parse forespørselen som JSON
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const priority1 = formData.get("priority1") as string;
    const priority2 = formData.get("priority2") as string;
    const priority3 = formData.get("priority3") as string;
    const file = formData.get("resume") as File;
    const ocrText = formData.get("ocrText") as string;

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

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    
    // Koble til databasen
    await dbConnect();

    // Opprett en ny søknad
    const newApplication = await Application.create({
      name,
      email,
      phone,
      priority1,
      priority2,
      priority3,
      filename: fileUrl, // Lagre S3-URL i databasen
      ocrText,
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

export async function GET() {
  try {
    // Koble til databasen
    await dbConnect();

    // Hent alle søknadene
    const applications = await Application.find({});

    // Returner søknadene som en JSON-respons
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente søknadene." },
      { status: 500 }
    );
  }
}

