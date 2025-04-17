const nextConfig = {
    async rewrites() {
        // Проверяем консолью, какую конфигурацию запускаем
        console.log(`Running Next.js in ${process.env.NODE_ENV} mode with rewrites enabled`);
        
        return [
            {
                source: '/new_age/:path*', // Перехватывает запросы, начинающиеся с /new_age/
                destination: 'http://147.45.153.94/new_age/:path*', // Проксирует их на ваш API
                // Добавляем конфигурацию для прокси, чтобы решить проблему с CORS
                has: [
                    {
                        type: 'header',
                        key: 'host',
                        value: '(?<host>.*)',
                    },
                ],
            },
        ]
    },
    
    // Добавляем настройки для решения проблемы с CORS
    async headers() {
        return [
            {
                // Применяем ко всем маршрутам
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ]
            }
        ]
    }
};

export default nextConfig;
