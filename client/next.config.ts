import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'm.media-amazon.com',
      'media-cdn.bnn.in.th',
      'image.uniqlo.com',
      // Add other domains for your product images
    ],
  },
};

export default nextConfig;
