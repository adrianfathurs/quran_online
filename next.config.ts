import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // GitHub Pages configuration
  basePath: '/quran_online',
  assetPrefix: '/quran_online',

  // Static export for GitHub Pages
  output: 'export',

  // Disable server-based features
  images: {
    unoptimized: true,
  },

  // Trailing slash for GitHub Pages
  trailingSlash: true,
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
})(nextConfig);
