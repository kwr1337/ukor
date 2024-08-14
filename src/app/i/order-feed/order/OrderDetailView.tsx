'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/buttons/Button';

export function OrderDetailView() {
    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('Option 1');
    const [orderDate, setOrderDate] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');

    const orderItems = [
        { code: 'U0508027', name: 'Брызговик двигателя (правый)', quantity: 1, price: 893.46, total: 1072.32, gtd: '107070/041123/3448134/2', brand: 'UKORAUTO', cost: 700, priceTag: 3179 },
        { code: 'U0517119', name: 'Решетка радиатора', quantity: 1, price: 4708.20, total: 4708.20, gtd: '107070/070723/3277360/23', brand: 'UKORAUTO', cost: 3000, priceTag: 3179 },
        { code: 'U1002331', name: 'Форсунка стеклоомывателя', quantity: 3, price: 216.78, total: 650.34, gtd: '107070/120423/3148245/43', brand: 'UKORAUTO', cost: 0, priceTag: 3179 },
        { code: 'U1310104', name: 'Выключатель (замок) зажигания', quantity: 1, price: 1292.10, total: 1292.10, gtd: '107070/050523/3181311/17', brand: 'UKORAUTO', cost: 600, priceTag: 3179 },
        { code: 'UAA96440307', name: 'Кольцо уплотнительное двигателя', quantity: 4, price: 106.98, total: 427.92, gtd: '-', brand: 'UKORAUTO', cost: 0, priceTag: 3309 }
    ];

    const rejectedItems = [
        { code: 'UHD22035312', name: 'Уплотнительное кольцо топливной форсунки', quantity: 4, price: 12.24, total: 48.96, gtd: '131060/191222/3615402/42', brand: 'UKORAUTO', cost: 0, priceTag: 'price3179' }
    ];

    const statusUpdates = [
        { status: "Новая", time: "9:15", date: "03.03.2024" },
        { status: "Отправлен запрос на склад", time: "9:30", date: "03.03.2024" },
        { status: "Пришел ответ от склада", time: "13:00", date: "03.03.2024" },
        { status: "Отправлен ответ клиенту", time: "13:15", date: "03.03.2024" },
        { status: "Отгружен", time: "16:00", date: "04.03.2024" }
    ];

    return (
        <div className="max-w-8xl w-full mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-4">
                        <div>
                            <input
                                type="text"
                                value={orderNumber}
                                placeholder={"Номер заказа"}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="px-4 py-1.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            >
                                <option value="">Клиент</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="date"
                                value={orderDate || ''}
                                onChange={(e) => setOrderDate(e.target.value)}
                                className="px-4 py-1.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700"></label>
                            <input
                                type="text"
                                value={invoiceNumber}
                                placeholder={'Номер накладной'}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white"
                            />
                        </div>
                        <div className="flex py-1">
                            <Button className="bg-primary text-white px-4 py-2 rounded-md">Выгрузить накладную</Button>
                        </div>
                    </div>

                    <div className="py-4">
                        <h2 className="text-xl font-medium mb-2">Состав заказа</h2>
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
                            {orderItems.map((item, index) => (
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

                    <div className="py-4">
                        <h2 className="text-xl font-medium mb-2">Отказ</h2>
                        <table className="min-w-full divide-y divide-gray-700 mt-2">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование детали</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена руб</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма руб</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер ГТД</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себе</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Прайс</th>
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

                    <div className="py-4 space-x-3 ">
                        <Button className="bg-primary text-white px-4 py-2 rounded-md">Сохранить</Button>
                        <Button className="bg-gray-300 px-4 py-2 rounded-md">Сохранить как черновик</Button>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">Отправить на сборку</Button>
                        <Button className="bg-red-500 text-white px-4 py-2 rounded-md">Удалить</Button>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 mt-16 md:w-1/3">
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
                    <Button className="bg-pink-500 text-white px-4 py-2 rounded">Запрос на снятие</Button>
                </div>
            </div>
        </div>
    );
}
