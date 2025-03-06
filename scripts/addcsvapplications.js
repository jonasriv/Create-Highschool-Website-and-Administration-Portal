const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const AWS = require("aws-sdk");
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

// Konfigurer AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_BUCKET_NAME;

// MongoDB tilkobling
const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB tilkoblet");
  } catch (error) {
    console.error("Feil ved tilkobling til MongoDB:", error);
    throw error;
  }
};

const applicationsCollection = () => db ? db.collection("applications") : null;

const uploadToS3 = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const fileName = `${Date.now()}_${path.basename(filePath)}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  try {
    console.log(`Starter opplasting av fil til S3: ${fileName}`);
    await s3.upload(params).promise();
    console.log(`Filen ${fileName} lastet opp til S3.`);
    return fileName;
  } catch (error) {
    console.error("Feil ved opplasting til S3:", error);
    return null;
  }
};

const addApplicationToDb = async (name, email, phone, priority1, priority2, priority3, filename) => {
  try {
    console.log(`Legger til søknad for ${name} i MongoDB...`);
    const collection = applicationsCollection();
    if (collection) {
      const result = await collection.insertOne({
        name,
        email,
        emailParent: "",
        phone,
        priority1,
        priority2,
        priority3,
        opptaksprove: "ja",
        filename,
        behandlet: 0,
        textractAnalysis: "",
        createdAt: new Date(),
      });
      console.log(`Søknad for ${name} lagt til. MongoDB result:`, result);
    } else {
      console.error("Feil: Ingen tilgang til MongoDB-kolleksjonen");
    }
  } catch (error) {
    console.error("Feil ved lagring i MongoDB:", error);
  }
};

// Endret fra processCsv til processTxt for tekstfilbehandling
const processTxt = async (filePath) => {
  console.log(`Starter prosessering av tekstfil: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.error("Tekstfil ikke funnet!");
    return;
  }

  const records = [];

  try {
    // Les inn filen synkront
    const data = fs.readFileSync(filePath, "utf8");

    // Del innholdet i linjer og fjern første linje (overskrifter)
    const lines = data.split("\n").slice(1); // slice(1) fjerner første rad (overskriften)

    // Prosesser hver linje
    for (const line of lines) {
      const fields = line.split(";");

      // Pass på at det er nok felter
      if (fields.length === 7) {
        const [name, email, phone, priority1, priority2, priority3, file] = fields;

        const record = { name, email, phone, priority1, priority2, priority3, file };
        records.push(record);
      }
    }

    console.log("Behandlet data:", records);

    if (records.length === 0) {
      console.log("Ingen data funnet i tekstfilen.");
      return;
    }

    console.log("Behandler hver søknad...");
    for (const row of records) {
      console.log(`Behandler søknad for: ${row.name}`);

      const { name, email, phone, priority1, priority2, priority3, file } = row;

      // Sjekk at alle nødvendige verdier finnes
      if (!name || !email || !phone || !priority1 || !priority2 || !priority3) {
        console.error("Manglende informasjon i søknad:", row);
        continue;
      }

      // Hvis det ikke finnes en fil, sett filename som null
      let filename = null;

      // Hvis en fil er spesifisert, prøv å laste den opp til S3
      if (file) {
        const filePath = path.join(__dirname, file); // Lokalt filsystembane

        if (!fs.existsSync(filePath)) {
          console.log(`Hoppet over ${file} fordi filen ikke finnes.`);
        } else {
          console.log(`Filen ${file} funnet på ${filePath}`);

          // Last opp fil til S3
          filename = await uploadToS3(filePath);
          if (!filename) {
            console.log(`Hoppet over ${file} grunnet feil ved opplasting.`);
            continue;
          }
          console.log(`Filen ${filename} lastet opp til S3`);
        }
      }

      // Legg søknaden til i MongoDB (med eller uten fil)
      await addApplicationToDb(name, email, phone, priority1, priority2, priority3, filename || "no-image");
    }

    console.log("Alle søknader behandlet.");
  } catch (error) {
    console.error("Feil ved prosessering av tekstfilen:", error);
  }
};


// Sett stien til tekstfilen du ønsker å prosessere
const txtFilePath = ""; // Endre til riktig sti til tekstfilen din

// Kall på funksjonen for å starte prosesseringen etter at MongoDB er tilkoblet
connectToDatabase().then(() => {
  processTxt(txtFilePath);
});
