/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["upload.wikimedia.org"],
    minimumCacheTTL: 43200,
  },
  output: "standalone",
};

module.exports = nextConfig;
