import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - added to support 127.0.0.1 fast refresh
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
