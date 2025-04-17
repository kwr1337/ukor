'use client'

import React, {useState} from 'react';
import {format} from 'date-fns';
import {Dialog, Transition} from '@headlessui/react';
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/buttons/Button";

export function ChinaCountRep() {

    const orders = [
        { part_number: '1350350011', quantity: 5, total: '600,00 Р', cost: '500,85 Р', gross_profit: '90,15 Р', profitability: '2%', remaining: 50 },
        { part_number: '1354050030', quantity: 3, total: '874,00 Р', cost: '788,04 Р', gross_profit: '1 085,96 Р', profitability: '22%', remaining: 22 },
        { part_number: '1780117020', quantity: 1, total: '378,00 Р', cost: '573,94 Р', gross_profit: '804,08 Р', profitability: '58%', remaining: 34 },
        { part_number: '1987432424', quantity: 12, total: '1 243,00 Р', cost: '896,00 Р', gross_profit: '2 700,24 Р', profitability: '10%', remaining: 48 },
        { part_number: '021115562A', quantity: 3, total: '510,00 Р', cost: '819,00 Р', gross_profit: '2 300,09 Р', profitability: '-31%', remaining: 0 },
        { part_number: '08H109069Q', quantity: 78, total: '42 000,00 Р', cost: '134,78 Р', gross_profit: '7 098,76 Р', profitability: '-17%', remaining: 0 },
        { part_number: '11427808443', quantity: 38, total: '9 906,20 Р', cost: '11 408,94 Р', gross_profit: '1 900,88 Р', profitability: '-15%', remaining: 0 },
        { part_number: '1341A042', quantity: 12, total: '21 135,00 Р', cost: '11 570,94 Р', gross_profit: '9 564,46 Р', profitability: '45%', remaining: 0 }
    ];






    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // const filteredOrders = orders.filter(order =>
    //     order.id.includes(searchValue) &&
    //     (!selectedDate || order.date === selectedDate)
    // );

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
                    <h1 className='text-3xl font-medium'>Отчеты Китай кол-во</h1>
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Остаток
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.part_number}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.part_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.gross_profit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.profitability}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.remaining}</td>
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
