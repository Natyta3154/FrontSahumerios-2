
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Para las imágenes de marcador de posición
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Para las imágenes de muestra
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'onrender.com', // Para las imágenes de tu API
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'media.istockphoto.com', // Para las imágenes de stock
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
