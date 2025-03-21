import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
};

export default nextConfig;
