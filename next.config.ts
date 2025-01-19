import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary URL
        pathname: '/**', // Tillat alle paths fra denne hosten
      },
    ],
  },
};

export default nextConfig;

