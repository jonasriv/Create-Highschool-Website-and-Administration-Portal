import dbConnect from "@/lib/mongoose";
import Admin from "@/models/admin";
import Application from "@/models/application";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Konfigurer S3-klienten
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

// Funksjon for å generere presigned URL for nedlasting
const generatePresignedUrl = async (bucketName: string, fileKey: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 time
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL", error);
    throw new Error("Unable to generate presigned URL");
  }
};

// POST: Autentisering
export async function POST(req: Request) {
  await dbConnect();

  const { username, password } = await req.json();

  // Finn admin-brukeren i databasen
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // Sjekk om passordet eksisterer i databasen
  if (!admin.password) {
    return NextResponse.json({ error: "No password set for this user" }, { status: 401 });
  }

  // Sammenlign passordet som er sendt med det hashede passordet i databasen
  try {
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    console.log("Is password valid: ", isPasswordValid); // Legg til logging av resultatet fra bcrypt.compare()

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Generer JWT-token hvis passordet er gyldig
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return NextResponse.json({ token });

  } catch (error) {
    console.error("Error comparing password:", error);
    return NextResponse.json({ error: "Error comparing password" }, { status: 500 });
  }
}

// GET: Hente applikasjoner og generere presigned URL for filnedlasting
// Hent applikasjoner og generere presigned URL for filnedlasting
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    await dbConnect();

    // Hent applikasjoner
    const applications = await Application.find({});
    console.log("Applications found:", applications);

    // Generer presigned URL for hver applikasjon
    const applicationsWithUrls = await Promise.all(applications.map(async (app) => {
      const filename = app.filename; // Hent filnavn fra applikasjonen
      let presignedUrl = null;

      if (filename) {
        // Generer presigned URL basert på filename
        try {
          presignedUrl = await generatePresignedUrl(process.env.AWS_S3_BUCKET_NAME!, filename);
        } catch (error) {
          console.error("Error generating presigned URL:", error);
        }
      }
      console.log(presignedUrl)
      return {
        ...app.toObject(),
        s3FileUrl: presignedUrl, // Legg til presigned URL i applikasjonen
      };
    }));

    // Returnere applikasjonene med presigned URL
    return NextResponse.json({
      applications: applicationsWithUrls,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
