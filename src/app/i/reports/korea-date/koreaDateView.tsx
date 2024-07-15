'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function KoreaDateView() {

    const orders = [
        { date: '15.03.2024', part_number: '4PK855', quantity: 113, total: '14 481,74 Р', cost: '- Р', gross_profit: '14 481,74 Р', profitability: '100%' },
        { date: '11.03.2024', part_number: '1041135', quantity: 108, total: '134 559,20 Р', cost: '121 258,00 Р', gross_profit: '13 301,44 Р', profitability: '10%' },
        { date: '07.03.2024', part_number: '92402M6100', quantity: 1, total: '23 527,98 Р', cost: '11 129,44 Р', gross_profit: '12 398,54 Р', profitability: '53%' },
        { date: '18.03.2024', part_number: '1041002', quantity: 27, total: '48 196,00 Р', cost: '38 267,94 Р', gross_profit: '9 927,96 Р', profitability: '19%' },
        { date: '14.03.2024', part_number: '1041135', quantity: 36, total: '49 127,48 Р', cost: '40 236,24 Р', gross_profit: '8 891,90 Р', profitability: '18%' },
        { date: '18.03.2024', part_number: '92102C1500', quantity: 25, total: '8 886,52 Р', cost: '5 564,72 Р', gross_profit: '2 320,80 Р', profitability: '26%' },
        { date: '13.03.2024', part_number: '4PK845', quantity: 33, total: '19 193,34 Р', cost: '12 000,00 Р', gross_profit: '7 193,34 Р', profitability: '28%' },
        { date: '11.03.2024', part_number: '1041002', quantity: 20, total: '25 700,00 Р', cost: '20 890,40 Р', gross_profit: '6 809,60 Р', profitability: '19%' }
    ];



    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);


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
                    <h1 className='text-3xl font-medium'>Отчеты Корея дата кол-во</h1>
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
                    <div className="px-6 py-4 overflow-y-auto">
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
                                <tr key={order.part_number}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.part_number}</td>
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
