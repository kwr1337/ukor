
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/new_age/:path*', // Перехватывает запросы, начинающиеся с /new_age/
                destination: 'http://147.45.153.94/new_age/:path*', // Проксирует их на ваш API
            },
        ]
    },
};

export default nextConfig;
