import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 关闭严格模式
  reactStrictMode: false,
  // 禁用 Turbopack
  experimental: {
    // 在 Next.js 16 中禁用 Turbopack
    turbo: {
      enabled: false,
    },
  },
};

export default nextConfig;
