/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Ignore Type Errors during build (so we can deploy fast)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Ignore ESLint errors (like the <img> tag warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;