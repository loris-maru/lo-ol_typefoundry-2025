import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better scroll handling
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },

  // Ensure proper build optimization
  swcMinify: true,

  // Add headers for better performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
