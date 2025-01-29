import { v2 as cloudinary } from "cloudinary";

// Config our cloudinary instance
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    const body = await request.json();
    const { paramsToSign } = body;
  
    console.log("Params to sign:", paramsToSign); // Logg paramsToSign for å sjekke hva som sendes
  
    // Generer signaturen
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );
  
    // Returner signaturen
    return new Response(
      JSON.stringify({ signature }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  