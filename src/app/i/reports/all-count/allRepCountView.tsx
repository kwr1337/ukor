'use client'

import React, {useState} from 'react';
import {format} from 'date-fns';
import {Dialog, Transition} from '@headlessui/react';
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/buttons/Button";

export function AllRepCountView() {

    const orders = [
        { id: '311121R000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 512, price: 539.00, date: '2024-03-25', total: 551.00, cost: 346.52, gross_profit: 203.48, profitability: '38%', GTD: 'Неизвестно' },
        { id: '246102E000', client: 'price3179', nomenclature: 'Неизвестно', quantity: 840, price: 400.00, date: '2024-03-25', total: 930.22, cost: 225.00, gross_profit: 705.20, profitability: '44%', GTD: 'Неизвестно' },
        { id: 'A2242415100', client: 'price3179', nomenclature: 'Неизвестно', quantity: 14, price: 278.00, date: '2024-03-25', total: 204.12, cost: 139.74, gross_profit: 784.98, profitability: '50%', GTD: 'Неизвестно' },
        { id: '273012B010', client: 'price3179', nomenclature: 'Неизвестно', quantity: 285, price: 230.00, date: '2024-03-25', total: 331.18, cost: 112.07, gross_profit: 973.84, profitability: '49%', GTD: 'Неизвестно' },
        { id: '283202F100', client: 'price3179', nomenclature: 'Неизвестно', quantity: 412, price: 211.00, date: '2024-03-25', total: 160.00, cost: 114.86, gross_profit: 421.88, profitability: '48%', GTD: 'Неизвестно' },
        { id: 'A2762000515', client: 'price3179', nomenclature: 'Неизвестно', quantity: 7, price: 84.00, date: '2024-03-25', total: 848.98, cost: 94.00, gross_profit: 848.98, profitability: '100%', GTD: 'Неизвестно' },
        { id: '263003S0505', client: 'price3179', nomenclature: 'Неизвестно', quantity: 735, price: 222.00, date: '2024-03-25', total: 267.80, cost: 94.22, gross_profit: 442.80, profitability: '42%', GTD: 'Неизвестно' },
        { id: '7031414110', client: 'price3179', nomenclature: 'Неизвестно', quantity: 903, price: 240.00, date: '2024-03-25', total: 290.38, cost: 185.65, gross_profit: 175.38, profitability: '23%', GTD: 'Неизвестно' }
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
                    <h1 className='text-3xl font-medium'>Отчеты Общее кол-во</h1>
                </div>
                <div className='my-3 h-0.5 bg-border w-full'/>
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
