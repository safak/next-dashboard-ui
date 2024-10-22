/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
  images: {
      localPatterns: [
        {
          pathname: '/public/upload/**',
          search: '',
        },
      ],
    },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thaipr.net',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'www.praram9.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
      },
      {
        protocol: 'https',
        hostname: 'i.gadgets360cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'banlakorn.com',
      },
      {
        protocol: 'https',
        hostname: 'f.ptcdn.info',
      },
      {
        protocol: 'https',
        hostname: 'static-00.iconduck.com',
      },
      
    ],
  },
};

export default nextConfig;
