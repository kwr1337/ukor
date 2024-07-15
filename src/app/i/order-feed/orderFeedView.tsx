'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function OrderFeedView() {

    const orders = [
        { id: '050', client: 'exist', status: 'Новая', date: '2024-03-11', articles: 20, sum: 20000, upl: '-' },
        { id: '123', client: 'exist', status: 'Новая', date: '2024-03-11', articles: 10, sum: 5000, upl: '-' },
        { id: '234', client: 'exist', status: 'Отправлен запрос на склад', date: '2024-03-11', articles: 2, sum: 3000, upl: '-' },
        { id: '534', client: 'exist', status: 'Сборка', date: '2024-03-11', articles: 3, sum: 4000, upl: '-' }
    ];

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const filteredOrders = orders.filter(order =>
        order.id.includes(searchValue) &&
        (!selectedDate || order.date === selectedDate) &&
        (!statusFilter || order.status === statusFilter)
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const mf = {
        marginLeft: "15%"
    }
    const f = {
        display: "flex"
    }

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className='text-3xl font-medium'>Заказы</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button onClick={() => setStatusFilter('Новая')} className="bg-primary text-white px-4 py-2 rounded">Новые</Button>
                        <Button onClick={() => setStatusFilter('Сборка')} className="bg-gray-200 px-4 py-2 rounded">На сборке</Button>
                        <Button onClick={() => setStatusFilter('Отправлен запрос на склад')} className="bg-gray-200 px-4 py-2 rounded">Отправлены клиенту</Button>
                        <Button onClick={() => setStatusFilter('Завершены')} className="bg-gray-200 px-4 py-2 rounded">Завершены</Button>
                    </div>
                </div>
                <div className='my-3 h-0.5 bg-border w-full' />
            </div>
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white"
                                placeholder="Введите значение для поиска"
                            />
                            <input
                                type="date"
                                value={selectedDate || ''}
                                onChange={handleDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            />
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Создать новый заказ
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">id</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">клиент</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">статус</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">дата заказа</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во артикулов</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер УПД</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.articles}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.sum}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.upl}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
