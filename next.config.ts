import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary URL
        pathname: '/**', // Tillat alle paths fra denne hosten
      },
      {
        protocol: 'https',
        hostname: 'media.snl.no', // Cloudinary URL
        pathname: '/**', // Tillat alle paths fra denne hosten
      },
      { protocol: "https", hostname: "media.snl.no" },

      // NRK (brukes ofte i RSS/og artikler)
      { protocol: "https", hostname: "gfx.nrk.no" },
      { protocol: "https", hostname: "akamaihd.net" }, // noen NRK-bilder kan ligge her
      { protocol: "https", hostname: "www.nrk.no" },

      // TU (kan variere)
      { protocol: "https", hostname: "www.tu.no" },
      { protocol: "https", hostname: "img.tu.no" },

      // forskning.no
      { protocol: "https", hostname: "www.forskning.no" },
      { protocol: "https", hostname: "forskning.no" },

      // SSB (ofte ingen bilder, men greit)
      { protocol: "https", hostname: "www.ssb.no" },      
      { protocol: "https", hostname: "images.gfx.no" },      
      // NDLA
      { protocol: "https", hostname: "images.ndla.no" },      
      // 
      { protocol: "https", hostname: "ichef.bbci.co.uk" },      
      // BBC
      { protocol: "https", hostname: "ichef.bbci.co.uk" },

      // The Guardian
      { protocol: "https", hostname: "media.guim.co.uk" },
      { protocol: "https", hostname: "i.guim.co.uk" },

      // Reuters
      { protocol: "https", hostname: "cloudfront-us-east-2.images.arcpublishing.com" },
      { protocol: "https", hostname: "www.reuters.com" },

      // NASA
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "images-assets.nasa.gov" },

      // UN News
      { protocol: "https", hostname: "news.un.org" },
      { protocol: "https", hostname: "global.unitednations.entermediadb.net" },

      // Al Jazeera
      { protocol: "https", hostname: "www.aljazeera.com" },
    ],
  },
};

export default nextConfig;

