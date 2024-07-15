'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function AllRepDateView() {

    const orders = [
        { id: 'A2242415100', client: 'price3179', nomenclature: 'Неизвестно', quantity: 8, price: 183.00, date: '2024-03-25', total: 104.00, cost: 79.00, gross_profit: 83.45, profitability: '51%', GTD: 'Неизвестно' },
        { id: '311121R000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 132, price: 155.00, date: '2024-03-20', total: 168.00, cost: 90.00, gross_profit: 283.30, profitability: '46%', GTD: 'Неизвестно' },
        { id: 'A2242415100', client: 'price3179', nomenclature: 'Неизвестно', quantity: 6, price: 113.00, date: '2024-03-07', total: 100.12, cost: 75.00, gross_profit: 59.83, profitability: '47%', GTD: 'Неизвестно' },
        { id: '263202F100', client: 'price3179', nomenclature: 'Неизвестно', quantity: 107, price: 67.00, date: '2024-03-25', total: 84.00, cost: 58.00, gross_profit: 377.88, profitability: '52%', GTD: 'Неизвестно' },
        { id: '248102E000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 102, price: 55.00, date: '2024-03-25', total: 538.00, cost: 27.00, gross_profit: 348.75, profitability: '51%', GTD: 'Неизвестно' },
        { id: '552603R000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 151, price: 137.00, date: '2024-03-20', total: 137.00, cost: 33.00, gross_profit: 658.41, profitability: '48%', GTD: 'Неизвестно' },
        { id: '23390YZZA4', client: 'price3179', nomenclature: 'Неизвестно', quantity: 11, price: 98.00, date: '2024-03-28', total: 225.00, cost: 12.00, gross_profit: 213.77, profitability: '86%', GTD: 'Неизвестно' },
        { id: '248102E000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 96, price: 45.00, date: '2024-03-08', total: 885.00, cost: 20.00, gross_profit: 148.00, profitability: '44%', GTD: 'Неизвестно' }
    ];



    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const filteredOrders = orders.filter(order =>
        order.id.includes(searchValue) &&
        (!selectedDate || order.date === selectedDate)
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
                    <h1 className='text-3xl font-medium'>Отчеты Общее дата кол-во</h1>
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
                                Сформировать
                            </Button>
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
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер
                                    детали
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Количество
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Откуп
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Валовая
                                    прибыль
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Рентабельность
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">GTD
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Клиент
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.gross_profit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.profitability}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.GTD}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
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
