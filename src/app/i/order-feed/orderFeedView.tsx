'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";

export function OrderFeedView() {
    const defaultOrders = [
        { id: '050', client: 'EXIST', status: 'Новая', date: '2024-03-11', articles: 20, sum: 20000, upl: '-' },
        { id: '123', client: 'EXIST', status: 'Новая', date: '2024-03-11', articles: 10, sum: 5000, upl: '-' },
        { id: '234', client: 'EXIST', status: 'Отправлен запрос на склад', date: '2024-03-11', articles: 2, sum: 3000, upl: '-' },
        { id: '534', client: 'EXIST', status: 'Сборка', date: '2024-03-11', articles: 3, sum: 4000, upl: '-' },
        // Пример заказов для других клиентов
        { id: '601', client: 'EMEX', status: 'Новая', date: '2024-03-11', articles: 5, sum: 12000, upl: '-' },
        { id: '602', client: 'ZZAP', status: 'Новая', date: '2024-03-11', articles: 3, sum: 8000, upl: '-' },
        { id: '603', client: 'AUTODOC', status: 'Сборка', date: '2024-03-11', articles: 7, sum: 15000, upl: '-' }
    ];

    const [orders, setOrders] = useState(defaultOrders);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({
        EXIST: false,
        EMEX: false,
        ZZAP: false,
        AUTODOC: false
    });

    const router = useRouter();

    useEffect(() => {
        // Загрузка состояния и заказов из localStorage при монтировании компонента
        const savedState = localStorage.getItem('orderFeedState');
        const savedOrders = localStorage.getItem('orders');
        if (savedState) {
            const { date, search, status } = JSON.parse(savedState);
            setSelectedDate(date || null);
            setSearchValue(search || '');
            setStatusFilter(status || null);
        }
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    useEffect(() => {
        // Сохранение состояния в localStorage при изменении состояния
        const state = {
            date: selectedDate,
            search: searchValue,
            status: statusFilter
        };
        localStorage.setItem('orderFeedState', JSON.stringify(state));
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [selectedDate, searchValue, statusFilter, orders]);

    const filteredOrders = orders.filter(order =>
        order.id.includes(searchValue) &&
        (!selectedDate || order.date === selectedDate) &&
        (!statusFilter || order.status === statusFilter)
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const groupedOrders = filteredOrders.reduce((groups, order) => {
        if (!groups[order.client]) {
            groups[order.client] = [];
        }
        groups[order.client].push(order);
        return groups;
    }, {} as Record<string, typeof orders>);

    const toggleClient = (client: string) => {
        setExpandedClients(prevState => ({
            ...prevState,
            [client]: !prevState[client]
        }));
    };

    const viewOrderDetails = (orderId: string) => {
        router.push(`${DASHBOARD_PAGES.ORDERDETAILVIEW}?orderId=${orderId}`);
    }

    return (
        <div>
            <div>
                <div className="flex">
                    <h1 className='text-3xl font-medium'>Заказы</h1>
                    <div className="flex mb-4 space-x-2 ml-72">
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
                                onClick={() => router.push(DASHBOARD_PAGES.ORDERDETAILVIEW)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Создать новый заказ
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        {Object.keys(groupedOrders).map(client => (
                            <div key={client} className="mb-8">
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleClient(client)}>
                                    <h2 className="text-xl font-medium">{client}</h2>
                                    <span>{expandedClients[client] ? '−' : '+'}</span>
                                </div>
                                {expandedClients[client] && (
                                    <table className="min-w-full divide-y divide-gray-700 mt-2">
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
                                        {groupedOrders[client].map((order) => (
                                            <tr key={order.id} onClick={() => viewOrderDetails(order.id)} className="cursor-pointer hover:bg-gray-700">
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
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
