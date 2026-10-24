import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: the full page is readable with JS disabled (DESIGN.md §11)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
