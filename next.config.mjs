/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimização de imagens
  images: {
    domains: ['localhost', 'api.qrserver.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },

  // Configurações para Netlify
  // output: 'standalone', // Remover para Netlify

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'CNH Social 2025',
  },
};

export default nextConfig;
