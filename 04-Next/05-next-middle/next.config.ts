import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cfg/old",
        destination: "/cfg/new",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/cfg/juanpi/api/:path*",
        destination: "http://localhost:8000/oppo/info",
      },
    ];
  },
};

export default nextConfig;
