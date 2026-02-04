import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  eslint: {
    // Re-enable for production readiness
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Re-enable for production readiness
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
