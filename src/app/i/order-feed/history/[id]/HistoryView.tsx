'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/buttons/Button'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'

interface HistoryItem {
  date: string
  time: string
  type: string
  field: string
  oldValue: string
  newValue: string
  user: string
  position: string
}

interface HistoryViewProps {
  orderId: string
}

export function HistoryView({ orderId }: HistoryViewProps) {
  const router = useRouter()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем историю изменений из localStorage
    const loadHistory = () => {
      const historyKey = `order_history_${orderId}`;
      const storedHistory = localStorage.getItem(historyKey);
      
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          setHistoryItems(parsedHistory);
        } catch (e) {
          console.error('Error parsing history from localStorage', e);
          setHistoryItems(getDefaultHistory());
        }
      } else {
        // Если истории нет, создаем демо-историю
        const defaultHistory = getDefaultHistory();
        localStorage.setItem(historyKey, JSON.stringify(defaultHistory));
        setHistoryItems(defaultHistory);
      }
      
      setLoading(false);
    };
    
    // Небольшая задержка для имитации загрузки с сервера
    setTimeout(loadHistory, 500);
  }, [orderId]);
  
  // Функция для создания демо-истории изменений
  const getDefaultHistory = (): HistoryItem[] => {
    return [
      {
        date: '19 марта',
        time: '20:26',
        type: 'Адрес склада',
        field: 'Адрес',
        oldValue: 'г. Нижнекамск, ул. Мира, д 23',
        newValue: 'г. Казань, ул. Крутовская',
        user: 'Гильманов Т.Р.',
        position: 'Менеджер'
      },
      {
        date: '19 марта',
        time: '20:26',
        type: 'Адрес склада',
        field: 'Адрес',
        oldValue: 'г. Нижнекамск, ул. Мира, д 23',
        newValue: 'г. Казань, ул. Крутовская',
        user: 'Гильманов Т.Р.',
        position: 'Менеджер'
      },
      {
        date: '19 марта',
        time: '20:26',
        type: 'Адрес склада',
        field: 'Адрес',
        oldValue: 'г. Нижнекамск, ул. Мира, д 23',
        newValue: 'г. Казань, ул. Крутовская',
        user: 'Гильманов Т.Р.',
        position: 'Менеджер'
      },
      {
        date: '19 марта',
        time: '20:26',
        type: 'Адрес склада',
        field: 'Адрес',
        oldValue: 'г. Нижнекамск, ул. Мира, д 23',
        newValue: 'г. Казань, ул. Крутовская',
        user: 'Гильманов Т.Р.',
        position: 'Менеджер'
      }
    ];
  };
  
  // Обработчик для добавления тестовой записи в историю
  const handleAddTestRecord = () => {
    const now = new Date();
    const newRecord: HistoryItem = {
      date: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: 'Тестовое изменение',
      field: 'Поле',
      oldValue: 'Старое значение',
      newValue: 'Новое значение',
      user: 'Тестовый пользователь',
      position: 'Тестировщик'
    };
    
    const updatedHistory = [...historyItems, newRecord];
    setHistoryItems(updatedHistory);
    
    // Сохраняем обновленную историю в localStorage
    const historyKey = `order_history_${orderId}`;
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">История изменений заказа #{orderId}</h1>
        <div className="flex gap-2">
          {/* <Button 
            onClick={handleAddTestRecord} 
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Добавить тестовую запись
          </Button> */}
          <Button 
            onClick={() => router.push(`${DASHBOARD_PAGES.ORDERDETAILVIEW}?id=${orderId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Вернуться к заказу
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <div className="loader">Загрузка...</div>
        </div>
      ) : historyItems.length > 0 ? (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Дата изменения
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Поле
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Было
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Стало
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Изменения
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {historyItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{item.date} · {item.time}</div>
                    <div className="text-xs text-gray-400">2023</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.oldValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.newValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{item.user}</div>
                    <div className="text-xs text-gray-400">{item.position}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-10 bg-gray-800 rounded-lg">
          <p className="text-lg">История изменений пуста</p>
        </div>
      )}
    </div>
  )
} 