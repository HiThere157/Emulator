/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["upload.wikimedia.org"],
    minimumCacheTTL: 43200,
  },
  headers: async () => {
    return [
      {
        source: "/api/roms/:id",
        headers: [
          {
            key: "Content-Encoding",
            value: "br",
          }
        ]
      },
      {
        source: "/api/states/:rom_id/:slot",
        headers: [
          {
            key: "Content-Encoding",
            value: "br",
          }
        ]
      }
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
