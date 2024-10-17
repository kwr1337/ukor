'use client'

import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";

export function OrderFeedView() {
    const defaultOrders = [
        { id: '050', client: 'EXIST', status: 'Новая', date: '2024-10-11', articles: 20, sum: 20000, upl: '-' },
        { id: '123', client: 'EXIST', status: 'Новая', date: '2024-10-11', articles: 10, sum: 5000, upl: '-' },
        { id: '234', client: 'EXIST', status: 'Отправлен запрос на склад', date: '2024-10-11', articles: 2, sum: 3000, upl: '-' },
        { id: '534', client: 'EXIST', status: 'Сборка', date: '2024-10-11', articles: 3, sum: 4000, upl: '-' },
        { id: '601', client: 'EMEX', status: 'Новая', date: '2024-10-11', articles: 5, sum: 12000, upl: '-' },
        { id: '602', client: 'ZZAP', status: 'Новая', date: '2024-10-11', articles: 3, sum: 8000, upl: '-' },
        { id: '603', client: 'AUTODOC', status: 'Сборка', date: '2024-10-11', articles: 7, sum: 15000, upl: '-' }
    ];

    const [orders, setOrders] = useState(defaultOrders);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
    const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({
        EXIST: false,
        EMEX: false,
        ZZAP: false,
        AUTODOC: false
    });

    const router = useRouter();

    useEffect(() => {
        const savedState = localStorage.getItem('orderFeedState');
        const savedOrders = localStorage.getItem('orders');

        // Установка дат по умолчанию - последняя неделя
        const now = new Date();
        const lastWeekStart = subDays(now, 7);
        const formattedStartDate = format(lastWeekStart, 'yyyy-MM-dd');
        const formattedEndDate = format(now, 'yyyy-MM-dd');

        if (savedState) {
            const { start, end, search, status, supplier } = JSON.parse(savedState);
            setStartDate(start || formattedStartDate);
            setEndDate(end || formattedEndDate);
            setSearchValue(search || '');
            setStatusFilter(status || null);
            setSupplierFilter(supplier || null);
        } else {
            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
        }

        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    useEffect(() => {
        const state = {
            start: startDate,
            end: endDate,
            search: searchValue,
            status: statusFilter,
            supplier: supplierFilter
        };
        localStorage.setItem('orderFeedState', JSON.stringify(state));
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [startDate, endDate, searchValue, statusFilter, supplierFilter, orders]);

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const isWithinDateRange = (!startDate || new Date(startDate) <= orderDate) &&
            (!endDate || orderDate <= new Date(endDate));
        return order.id.includes(searchValue) &&
            (!statusFilter || order.status === statusFilter) &&
            (!supplierFilter || order.client === supplierFilter) &&
            isWithinDateRange;
    });

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
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
    };

    const countOrdersByStatus = (status: string) => {
        return orders.filter(order => order.status === status).length;
    };

    return (
        <div>
            <div>
                <div className="flex">
                    <h1 className='text-3xl font-medium'>Заказы</h1>
                    <div className="flex mb-4 space-x-2 ml-72">
                        <Button onClick={() => setStatusFilter(null)} className="bg-primary text-white px-4 py-2 rounded">
                            Все ({orders.length})
                        </Button>
                        <Button onClick={() => setStatusFilter('Новая')} className="bg-primary text-white px-4 py-2 rounded">
                            Новые ({countOrdersByStatus('Новая')})
                        </Button>
                        <Button onClick={() => setStatusFilter('Сборка')} className="bg-gray-200 px-4 py-2 rounded">
                            На сборке ({countOrdersByStatus('Сборка')})
                        </Button>
                        <Button onClick={() => setStatusFilter('Отправлен запрос на склад')} className="bg-gray-200 px-4 py-2 rounded">
                            Отправлены клиенту ({countOrdersByStatus('Отправлен запрос на склад')})
                        </Button>
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
                            <select
                                value={supplierFilter || ''}
                                onChange={(e) => setSupplierFilter(e.target.value || null)}
                                className="px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Все поставщики</option>
                                <option value="EXIST">EXIST</option>
                                <option value="EMEX">EMEX</option>
                                <option value="ZZAP">ZZAP</option>
                                <option value="AUTODOC">AUTODOC</option>
                            </select>
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
                                                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(order.date), 'dd.MM.yyyy', { locale: ru })}</td>
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
