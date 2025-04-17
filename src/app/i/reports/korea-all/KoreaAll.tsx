'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function KoreaAllView() {

    const orders = [
        { id: '03H121117A', client: 'Авто-Евро', nomenclature: 'Корпус термостата', quantity: 1, price: 821.86, date: '2024-03-01', total: 821.86, cost: 948.64, gross_profit: -126.78, profitability: '-1%', GTD: '10702070/271023/343726' , price1: "price3310"},
        { id: '1011006', client: 'Авто-Евро', nomenclature: 'Масло трансмиссионное XTeer ATF SP4_1L', quantity: 3, price: 487.98, date: '2024-03-01', total: 1463.94, cost: 1233.87, gross_profit: 230.07, profitability: '16%', GTD: '10009100/220124/30067', price1: "price3119" },
        { id: '1041013', client: 'Авто-Евро', nomenclature: 'Масло моторное синтетическое XTeer TOP 5W40_4L', quantity: 1, price: 879.98, date: '2024-03-01', total: 879.98, cost: 1103.43, gross_profit: -223.45, profitability: '-12%', GTD: '10009100/220124/30067', price1: "price3179" },
        { id: '1041019', client: 'Авто-Евро', nomenclature: 'Масло моторное синтетическое XTeer G800 SP 10W-40_4L', quantity: 1, price: 828.02, date: '2024-03-01', total: 828.02, cost: 477.80, gross_profit: 350.22, profitability: '19%', GTD: '10009100/220124/30067', price1: "price3179" },
        { id: '4PK815', client: 'Авто-Евро', nomenclature: 'Ремень', quantity: 1, price: 208.02, date: '2024-03-01', total: 208.02, cost: 227.00, gross_profit: -18.98, profitability: '-9%', GTD: '11220734/300323/00067' , price1: "price3119"},
        { id: '8R0853909A', client: 'Авто-Евро', nomenclature: 'Клипса', quantity: 5, price: 83.76, date: '2024-03-01', total: 418.80, cost: 408.60, gross_profit: 10.20, profitability: '2%', GTD: '10702070/271023/343726' , price1: "price3119"},
        { id: 'KOS451', client: 'Авто-Евро', nomenclature: 'Сальник', quantity: 1, price: 187.98, date: '2024-03-01', total: 187.98, cost: 138.90, gross_profit: 49.08, profitability: '26%', GTD: '11220734/300323/00067' , price1: "price3119"},
        { id: 'U0107016R', client: 'Авто-Евро', nomenclature: 'Трос стояночного тормоза (с электроприводом)', quantity: 1, price: 950.00, date: '2024-03-01', total: 950.00, cost: 647.60, gross_profit: 302.40, profitability: '32%', GTD: '10702070/110124/301272', price1: "price3119" }
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
                    <h1 className='text-3xl font-medium'>Отчеты корея</h1>
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Клиент
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номенклатура
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Количество
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Итого
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себес
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Прайс
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
                                    <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.nomenclature}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.gross_profit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.profitability}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.GTD}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
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
