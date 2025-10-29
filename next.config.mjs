/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://crm-server-chi.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
