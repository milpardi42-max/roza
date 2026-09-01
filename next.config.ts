import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "roza";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // برای GitHub Pages باید استاتیک اکسپورت کنیم
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  trailingSlash: isGithubPages ? true : undefined,
  images: {
    unoptimized: isGithubPages ? true : false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1600, 1920],
  },
  async redirects() {
    // در حالت export ریدایرکت سرور کار نمی‌کند، صفحه‌ی روت خودش ریدایرکت می‌کند
    if (isGithubPages) return [];
    return [{ source: "/", destination: "/fa", permanent: false }];
  },
};

export default nextConfig;
