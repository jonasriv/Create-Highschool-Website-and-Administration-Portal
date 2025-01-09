// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /pdfjs-dist/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/pdfjs/[name].[ext]',
            },
          },
        ],
      });
    }
    return config;
  },
};

export default nextConfig;
