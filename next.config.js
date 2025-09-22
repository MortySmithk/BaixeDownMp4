/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;