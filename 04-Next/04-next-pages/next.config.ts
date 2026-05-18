import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/profile_v2",
        destination: "/profile/1000",
      },
    ];
  },
};

export default nextConfig;
