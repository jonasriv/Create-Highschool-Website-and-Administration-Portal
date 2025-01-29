"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Cloudinary {
    createMediaLibrary: (options: {
      cloud_name: string;
      api_key: string;
      multiple: boolean;
      max_files: number;
    }, handlers: {
      insertHandler: (data: CloudinaryInsertEvent) => void;
    }) => { show: () => void };
    // Bruk Record<string, unknown> for å tillate vilkårlige egenskaper uten å bruke `any`
    [key: string]: unknown; // Tillater dynamiske egenskaper uten `any`
  }

  interface Window {
    cloudinary: Cloudinary;
  }
}

interface CloudinaryAsset {
  public_id: string;
  secure_url: string;
}

interface CloudinaryInsertEvent {
  assets: CloudinaryAsset[];
}

interface MediaLibraryProps {
  onImageSelected: (imageUrl: string) => void;
}

export default function MediaLibrary({ onImageSelected }: MediaLibraryProps) {
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  useEffect(() => {
    if (window.cloudinary) {
      setCloudinaryReady(true);
    }
  }, []);

  const openMediaLibrary = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!cloudinaryReady) {
      console.error("Cloudinary is not ready yet.");
      return;
    }

    const cloudinary = window.cloudinary;
    const mediaLibrary = cloudinary.createMediaLibrary(
      {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
        multiple: false,
        max_files: 20,
      },
      {
        insertHandler: (data: CloudinaryInsertEvent) => {
          if (data.assets.length > 0) {
            const imageUrl = data.assets[0].secure_url;
            onImageSelected(imageUrl); // Kall på funksjonen fra moderator-komponenten
          }
        },
      }
    );
    mediaLibrary.show();
  };

  return (
    <div>
      <Script
        src="https://media-library.cloudinary.com/global/all.js"
        strategy="lazyOnload"
        onLoad={() => setCloudinaryReady(true)}
      />
      <button onClick={openMediaLibrary} disabled={!cloudinaryReady} className="bg-sky-600 p-2 rounded-lg w-full text-sm md:text-md">
        Velg bilde fra Cloudinary
      </button>
    </div>
  );
}
