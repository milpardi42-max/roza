import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1600, 1920],
  },
  async redirects() {
    return [
      { source: "/", destination: "/fa", permanent: false },
    ];
  },
};

export default nextConfig;
