/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/next-dashboard-ui" : "",
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/next-dashboard-ui" : "",
};

export default nextConfig;
