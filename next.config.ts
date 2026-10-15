import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
  // SQLite-база должна попасть в serverless-бандл API-роутов на Vercel
  outputFileTracingIncludes: {
    "/api/**": ["./db/custom.db"],
    "/api/**/*": ["./db/custom.db"],
  },
};

export default nextConfig;
