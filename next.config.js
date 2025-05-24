/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',

});

const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  
};

module.exports = withPWA(nextConfig);