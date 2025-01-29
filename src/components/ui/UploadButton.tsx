'use client';
import { CldUploadButton, type CldUploadButtonProps } from "next-cloudinary";

// Bare fjern logikken som håndterer URL-en
function UploadButton(props: CldUploadButtonProps) {

  // Fjern håndtering av resultatet, så vi bare får beskjed når opplastingen er fullført
  const handleUpload = () => {
    console.log("Upload complete");
  };

  return (
    <CldUploadButton 
      {...props}
      onUpload={handleUpload} // Bare bekreft opplastingen
    />
  );
}

export default UploadButton;