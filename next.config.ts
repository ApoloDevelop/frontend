import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "i.scdn.co",
      "i.imgur.com",
      "lastfm.freetls.fastly.net",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
