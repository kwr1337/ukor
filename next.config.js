/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Отключаем проверки Suspense boundary для CSR bailout
  experimental: {
    // Отключаем предупреждения о необходимости Suspense boundary
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig 