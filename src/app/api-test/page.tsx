'use client'

import { useState } from 'react'
import { API_BASE_URL } from '@/config/api.config'

export default function ApiTestPage() {
  const [resultDirect, setResultDirect] = useState<string>('');
  const [resultProxy, setResultProxy] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setError(null);
    
    try {
      // Тест 1: прямой URL
      const directUrl = 'http://147.45.153.94/new_age/API/contragents/get_contragents.php';
      console.log('Тестирую прямой URL:', directUrl);
      const directResponse = await fetch(directUrl);
      const directData = await directResponse.json();
      setResultDirect(JSON.stringify(directData.slice(0, 2), null, 2));
      
      // Тест 2: через rewrites
      const proxyUrl = `${API_BASE_URL}/new_age/API/contragents/get_contragents.php`;
      console.log('Тестирую через rewrites:', proxyUrl);
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      setResultProxy(JSON.stringify(proxyData.slice(0, 2), null, 2));
    } catch (err: any) {
      setError(`Ошибка при тестировании API: ${err.message}`);
      console.error('Полная ошибка:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Тест API-соединений</h1>
      
      <div className="mb-4">
        <button 
          onClick={testAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Проверить API
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Прямой URL</h2>
          <div className="mb-2 text-sm text-gray-400">
            http://147.45.153.94/new_age/API/contragents/get_contragents.php
          </div>
          <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-60 text-sm">
            {resultDirect || 'Нажмите кнопку "Проверить API"'}
          </pre>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Через rewrites</h2>
          <div className="mb-2 text-sm text-gray-400">
            {API_BASE_URL}/new_age/API/contragents/get_contragents.php
          </div>
          <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-60 text-sm">
            {resultProxy || 'Нажмите кнопку "Проверить API"'}
          </pre>
        </div>

        <div className="col-span-1 md:col-span-2 bg-gray-800 p-4 rounded-lg">
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