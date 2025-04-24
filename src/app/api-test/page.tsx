'use client'

import { useState } from 'react'
import { API_BASE_URL } from '@/config/api.config'

export default function ApiTestPage() {
  const [resultProxy, setResultProxy] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setError(null);
    setResultProxy(''); // Очищаем предыдущий результат
    
    try {
      // Используем относительный путь для прокси с префиксом /api
      const proxyUrl = `/api/contragents/get_contragents.php`;
      console.log('Тестирую через прокси:', proxyUrl);
      const proxyResponse = await fetch(proxyUrl);

      // Проверяем статус ответа
      if (!proxyResponse.ok) {
        throw new Error(`Ошибка сети: ${proxyResponse.status} ${proxyResponse.statusText}`);
      }

      const proxyData = await proxyResponse.json();
      setResultProxy(JSON.stringify(proxyData.slice(0, 2), null, 2));
    } catch (err: any) {
      setError(`Ошибка при тестировании API: ${err.message}`);
      console.error('Полная ошибка:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Тест API через Proxy</h1>
      
      <div className="mb-4">
        <button 
          onClick={testAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Проверить API через Proxy
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Результат через Proxy</h2>
          <div className="mb-2 text-sm text-gray-400">
            /api/contragents/get_contragents.php
          </div>
          <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-60 text-sm">
            {resultProxy || 'Нажмите кнопку "Проверить API через Proxy"'}
          </pre>
        </div>

        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Информация о среде</h2>
          <div className="bg-gray-900 p-3 rounded overflow-auto">
            <div>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'не определено'}
            </div>
            <div>
              <strong>API_BASE_URL:</strong> {API_BASE_URL || '(пустая строка)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 