/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {hostname:"images.pexels.com"},
            {hostname:"i.pravatar.cc"}
        ],
    }
};

export default nextConfig;
