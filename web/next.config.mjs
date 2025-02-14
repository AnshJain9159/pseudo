/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.aceternity.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  experimental: {
    appDir: true,
  },
  // Tell Next.js to use `web/src/` as the base directory
  dir: "web/src",
};

export default nextConfig;
