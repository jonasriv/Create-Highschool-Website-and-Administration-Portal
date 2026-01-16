import dbConnect from "@/lib/mongoose";
import Application from "@/models/application";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import nodemailer from 'nodemailer';
import { verifyToken } from "@/app/admin/verifyToken";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// Konfigurer S3-klienten
const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-2',
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
    const opptaksprove = formData.get("opptaksprove") as string;
    const hovedinstrument = formData.get("hovedinstrument") as string;
    const skoleaar = formData.get("skoleaar") as string;
    const file = formData.get("resume") as File;
    const behandlet = 0 as number;
    const fakturanavn = formData.get("fakturanavn") as string;
    const fakturaepost = formData.get("fakturaepost") as string;
    const fakturagateadresse = formData.get("fakturagateadresse") as string;
    const fakturapostnummer = formData.get("fakturapostnummer") as string;
    const fakturapoststed = formData.get("fakturapoststed") as string;    
    const fakturaland = formData.get("fakturaland") as string || "Norge";    

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return NextResponse.json(
        { error: "Filen mangler." },
        { status: 400 }
      );
    }
    
    // Sjekk filstørrelse
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Filen er for stor. Prøv igjen med et bilde som tar mindre plass, eller ta kontakt på mail@create.no." },
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
      hovedinstrument,
      skoleaar,
      filename: fileUrl, // Lagre S3-URL i databasen
      textractAnalysis: "",  // Lagre Textract-resultatet (kan være null hvis analysen feiler)
      behandlet,  //setter status til ubehandlet
      opptaksprove,
      fakturanavn,
      fakturaepost,
      fakturagateadresse,
      fakturapostnummer,
      fakturapoststed,
      fakturaland
    });
    // Nodemailer-konfigurasjon
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // SMTP-server for Office 365
      port: 587,                  // Port 587 for TLS
      secure: false,              // Bruker ikke SSL, men TLS
      auth: {
        user: process.env.EMAIL_USER, // E-postadressen din (f.eks. mail@create.no)
        pass: process.env.EMAIL_PASS, // E-postpassordet ditt
      },
    });
      
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [email, emailParent], // E-postadresse til administratoren
      subject: 'Søknad mottatt',
      text: `
        Hei! Vi har mottatt en søknad fra deg. Her er detaljene:
        
        Navn: ${name}
        Skoleår: ${skoleaar}
        E-post: ${email}
        E-post (foresatt): ${emailParent}
        Telefon: ${phone}
        Prioritet 1: ${priority1}
        Prioritet 2: ${priority2}
        Prioritet 3: ${priority3}
        Hovedinstrument: ${hovedinstrument}
        Opptaksprøve: ${opptaksprove}
        Fakturamottaker: ${fakturanavn}
        Faktura-epost: ${fakturaepost}
        Faktura-adresse: ${fakturagateadresse}, ${fakturapostnummer} ${fakturapoststed} (${fakturaland}) 

        Mvh Create - Lillehammer kreative videregående skole
      `,
    };

    // Send e-post
    try {
      await transporter.sendMail(mailOptions);
      console.log('Søknadsbekreftelse sendt søker og forelder');
    } catch (error) {
      console.error('Feil ved sending av e-post: ', error);
    }

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
      { error: "Kunne ikke sende inn søknaden. Prøv igjen med et mindre bilde, eller ta kontakt på mail@create.no" },
      { status: 500 }
    );
  }
};

// GET: Hent søknader og generer presigned URL-er
export async function GET(req: NextRequest) {
  
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
};
