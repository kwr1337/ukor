'use client'

import React, {useState} from 'react';
import {format} from 'date-fns';
import {Dialog, Transition} from '@headlessui/react';
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/buttons/Button";

export function ChinaAllView() {

    const orders = [
        { id: '1350350011', client: 'Автотигер', nomenclature: 'Ролик натяжителя', quantity: 1, price: 1108.02, date: '2024-03-14', total: 1108.02, cost: 1101.97, gross_profit: 6.03, profitability: '1%', GTD: 'Неизвестно' },
        { id: '1354050030', client: 'Автотигер', nomenclature: 'НАТЯЖИТЕЛЬ РЕМНЯ', quantity: 1, price: 1858.02, date: '2024-03-01', total: 1858.02, cost: 1262.68, gross_profit: 595.34, profitability: '32%', GTD: 'Неизвестно' },
        { id: '1780117020', client: 'Автотигер', nomenclature: 'Фильтр воздушный', quantity: 1, price: 1378.02, date: '2024-03-22', total: 1378.02, cost: 804.28, gross_profit: 573.74, profitability: '42%', GTD: 'Неизвестно' },
        { id: '1987432424', client: 'Автотигер', nomenclature: 'Фильтр воздушный (салона) угольный', quantity: 1, price: 1138.02, date: '2024-03-15', total: 1138.02, cost: 908.00, gross_profit: 230.02, profitability: '20%', GTD: 'Неизвестно' },
        { id: '1987432424', client: 'Автосталь', nomenclature: 'Фильтр воздушный (салона) угольный', quantity: 2, price: 1138.02, date: '2024-03-10', total: 2276.04, cost: 1816.00, gross_profit: 460.04, profitability: '20%', GTD: 'Неизвестно' },
        { id: '1987432424', client: 'Автосталь', nomenclature: 'Фильтр воздушный (салона) угольный', quantity: 1, price: 1138.02, date: '2024-03-10', total: 1138.02, cost: 908.00, gross_profit: 230.02, profitability: '20%', GTD: 'Неизвестно' },
        { id: '0211155624', client: 'Автосталь', nomenclature: 'Фильтр масляный двигателя', quantity: 1, price: 170.00, date: '2024-03-01', total: 170.00, cost: 273.00, gross_profit: -103.00, profitability: '-61%', GTD: 'Неизвестно' },
        { id: '0211155624', client: 'Автосталь', nomenclature: 'Фильтр масляный двигателя', quantity: 1, price: 170.00, date: '2024-03-14', total: 170.00, cost: 273.00, gross_profit: -103.00, profitability: '-61%', GTD: 'Неизвестно' },
        { id: '0811059050', client: 'Автосталь', nomenclature: 'Успокоитель цепи', quantity: 10, price: 458.00, date: '2024-03-01', total: 4580.00, cost: 6465.91, gross_profit: -1885.91, profitability: '-41%', GTD: 'Неизвестно' }
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
                    <h1 className='text-3xl font-medium'>Отчеты Китай</h1>
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Контрагент
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер
                                    детали
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себес
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
                                    <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.nomenclature}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.cost}</td>
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
