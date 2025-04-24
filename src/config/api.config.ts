/**
 * Конфигурация API 
 * 
 * В режиме разработки (dev): пустая строка для использования относительных URL и rewrites из next.config.js
 * В режиме продакшена (production): используем относительный путь /api для проксирования через Next.js.
 */

// Определяем базовый URL в зависимости от среды
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment ? '' : '/api';

console.log(`API_BASE_URL set to: "${API_BASE_URL}" (NODE_ENV: ${process.env.NODE_ENV})`); 