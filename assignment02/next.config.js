/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/tiles',
        destination: '/tiles?level=1',
      },
    ]
  },
}

module.exports = nextConfig
