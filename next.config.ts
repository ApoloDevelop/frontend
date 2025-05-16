import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Permite cargar imágenes desde Cloudinary
  },
};

export default nextConfig;
