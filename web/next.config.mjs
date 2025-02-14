/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.aceternity.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
