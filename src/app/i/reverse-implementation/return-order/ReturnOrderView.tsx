'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/buttons/Button';

export function ReturnOrderView() {
    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const rejectedItems = [
        { code: 'UHD22035312', name: 'Уплотнительное кольцо топливной форсунки', quantity: 4, price: 12.24, total: 48.96, gtd: '131060/191222/3615402/42', brand: 'UKORAUTO', cost: 0, priceTag: 'price3179' }
    ];

    const statusUpdates = [
        { status: "Новая", time: "9:15", date: "03.03.2024" },
        { status: "Отправлен на рассмотрение", time: "9:30", date: "03.03.2024" },
        { status: "Одобрен", time: "13:15", date: "03.03.2024" },
        { status: "Не одобрен", time: "16:00", date: "04.03.2024" }
    ];

    return (
        <div className="max-w-8xl w-full mx-auto space-y-1">
            <div className="flex items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Номер возврата</label>
                    <input
                        type="text"
                        value={orderNumber}
                        placeholder="Номер возврата"
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Клиент</label>
                    <input
                        type="text"
                        value={client}
                        placeholder="Клиент"
                        onChange={(e) => setClient(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Номер заказа</label>
                    <input
                        type="text"
                        value={orderNumber}
                        placeholder="Номер заказа"
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата заказа</label>
                    <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата возврата </label>
                    <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                    />
                </div>

            </div>

            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                    <div className="py-4">
                        <h2 className="text-xl font-medium mb-2">Возврат</h2>
                        <table className="min-w-full divide-y divide-gray-700 mt-2">
                            <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование детали</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена руб</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма руб</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер ГТД</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себе</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Прайс</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {rejectedItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.gtd}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.priceTag}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="py-4 space-x-3">
                        <Button className="bg-primary text-white px-4 py-2 rounded-md">Сохранить</Button>
                        <Button className="bg-gray-300 px-4 py-2 rounded-md">Сохранить как черновик</Button>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">Удалить</Button>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 md:w-3/3">
                    <h2 className="font-semibold text-xl">Статус заказа</h2>
                    <div className="border-l-2 border-gray-300 pl-4 space-y-2">
                        {statusUpdates.map((update, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded-full ${index === 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                <div className="flex flex-col">
                                    <span>{update.status}</span>
                                    <span className="text-xs text-gray-500">{update.time} | {update.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
