'use client'

import React, {useState} from 'react';
import {format} from 'date-fns';
import {Dialog, Transition} from '@headlessui/react';
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/buttons/Button";

export function ChinaAllView() {

    const orders = [
        { date: '2024-03-21', id: '2151323001', quantity: 507, total: '297,14 Р', cost: '- Р', gross_profit: '7 297,14 Р', profitability: '100%' },
        { date: '2024-03-01', id: '2151223001', quantity: 315, total: '247,00 Р', cost: '74,28 Р', gross_profit: '10 014,35 Р', profitability: '41%' },
        { date: '2024-03-22', id: '703141410', quantity: 303, total: '803,94 Р', cost: '116,00 Р', gross_profit: '11 194,92 Р', profitability: '100%' },
        { date: '2024-03-15', id: '2151323001', quantity: 151, total: '713,02 Р', cost: '- Р', gross_profit: '2 713,02 Р', profitability: '100%' },
        { date: '2024-03-20', id: '552603R000', quantity: 151, total: '591,47 Р', cost: '33,90 Р', gross_profit: '7 058,41 Р', profitability: '15%' },
        { date: '2024-03-12', id: '283003S0505', quantity: 140, total: '419,04 Р', cost: '24,04 Р', gross_profit: '7 307,04 Р', profitability: '100%' },
        { date: '2024-03-20', id: '311121R000', quantity: 185, total: '156,22 Р', cost: '80,22 Р', gross_profit: '7 583,30 Р', profitability: '48%' },
        { date: '2024-03-29', id: '703141410', quantity: 120, total: '774,92 Р', cost: '600,00 Р', gross_profit: '4 174,92 Р', profitability: '23%' }
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
                    <h1 className='text-3xl font-medium'>Отчеты Китай дата кол-во</h1>
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
