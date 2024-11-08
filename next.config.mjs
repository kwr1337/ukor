/** @type {import('next').NextConfig} */
const nextConfig = {

    module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*', // Разрешает доступ со всех источников
            },
          ],
        },
      ];
    },
  };
};

export default nextConfig;
