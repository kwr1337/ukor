'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";

export function RevImpView() {
    const data = [
        {orderId: '123454', orderDate: '2024-03-11', returnDate: '2024-03-18', client: 'emex', article: 'U43534', name: 'Сальник', quantity: 2, price: 50, total: 100, returnWarehouse: 'price3179', status: 'Одобрен'},
        {orderId: '123454', orderDate: '2024-03-11', returnDate: '2024-03-18', client: 'ruur', article: 'U43534', name: 'Сальник', quantity: 2, price: 50, total: 100, returnWarehouse: 'price3179', status: 'Одобрен'}
    ];

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);  // Начальная дата
    const [endDate, setEndDate] = useState<string | null>(null);      // Конечная дата

    // Получаем уникальных клиентов
    const uniqueClients = Array.from(new Set(data.map(order => order.client)));

    // Логика фильтрации по диапазону дат
    const isWithinDateRange = (returnDate: string) => {
        const date = new Date(returnDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
            return date >= start && date <= end;
        } else if (start) {
            return date >= start;
        } else if (end) {
            return date <= end;
        }
        return true; // если не указаны ни начало, ни конец, пропускаем все
    };

    // Фильтрация данных
    const filteredOrders = data.filter(order =>
        order.orderId.includes(searchValue) &&
        (!statusFilter || order.status === statusFilter) &&
        (!selectedClient || order.client === selectedClient) &&
        isWithinDateRange(order.returnDate) // фильтруем по диапазону дат
    );

    // Обработка изменения диапазона дат
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const router = useRouter();

    const rout = () => {
        router.push(DASHBOARD_PAGES.RETURNORDERVIEW);
    };

    const mf = { marginLeft: "25%" };
    const f = { display: "flex" };

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className="text-3xl font-medium">Обратная реализация</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button className="bg-primary text-white px-4 py-2 rounded">Новые</Button>
                        <Button className="bg-gray-200 px-4 py-2 rounded">Архив</Button>
                    </div>
                </div>
                <div className="my-3 h-0.5 bg-border w-full" />
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
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            >
                                <option value="">Все клиенты</option>
                                {uniqueClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={startDate || ''}
                                onChange={handleStartDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                value={endDate || ''}
                                onChange={handleEndDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            />
                            <Button
                                onClick={rout}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Зарегистрировать новый возврат
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">id заказа</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">дата заказа</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">дата возврата</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Клиент</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Склад возврата</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map(order => (
                                <tr key={order.orderId}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.orderDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.returnDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.article}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.returnWarehouse}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
