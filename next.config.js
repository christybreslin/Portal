/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    PORT_DEV: process.env.PORT_DEV,
    PORT_PROD: process.env.PORT_PROD,
  },
}

module.exports = nextConfig