/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable service worker in development
  // Optional: Add more PWA configuration here
  // register: true,
  // skipWaiting: true,
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
  // Optional: Add other Next.js config options here
  // reactStrictMode: true,
  // images: {
  //   domains: ['yourdomain.com'],
  // },
};

module.exports = withPWA(nextConfig);