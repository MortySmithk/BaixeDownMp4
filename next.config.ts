import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Adiciona a configuração de imagens
  images: {
    remotePatterns: [
      {
        // Permissão para a sua logo
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        // Permissão para as capas dos filmes e séries
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;