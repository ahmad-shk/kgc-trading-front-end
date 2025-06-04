/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',         // when visiting /
        destination: '/trade/BNBUSDT', // redirect to /markets/overview
        permanent: true,     // 308 Permanent Redirect
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['cryptologos.cc'],
  },
 
  
}

export default nextConfig
