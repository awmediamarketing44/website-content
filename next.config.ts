import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "/assets",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
