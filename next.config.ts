import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";
    return [
      {
        source: "/api/:path*",
        destination: isProd
          ? "/_/backend/api/:path*"
          : "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
