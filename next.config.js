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

<<<<<<< HEAD
module.exports = nextConfig;
=======
module.exports = nextConfig;
>>>>>>> 4a62ad01a9abc2c55a29214b476f6347934a0596
