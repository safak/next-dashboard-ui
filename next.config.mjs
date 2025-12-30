/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // You might need this if you use images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
