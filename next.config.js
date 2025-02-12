// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGO_URI,
  },
}

module.exports = nextConfig