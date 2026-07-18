import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "asgharalimubarakblog.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "*.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
      },
    ],
  },
};

export default nextConfig;
