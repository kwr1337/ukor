/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Отключаем проверки Suspense boundary для CSR bailout
  experimental: {
    // Отключаем предупреждения о необходимости Suspense boundary
    missingSuspenseWithCSRBailout: false,
  },
  
  async rewrites() {
    console.log(`Running Next.js in ${process.env.NODE_ENV} mode with rewrites enabled`);
    return [
      {
        source: '/api/:path*',
        destination: 'http://147.45.153.94/new_age/API/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 