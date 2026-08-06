import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* components/icons.tsx pulls named icons out of Phosphor's SSR barrel,
       which re-exports several thousand modules. This rewrites those to
       direct imports so a build never walks the whole set. */
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
