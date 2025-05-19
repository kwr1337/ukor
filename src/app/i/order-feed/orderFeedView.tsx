'use client';

import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import axios from 'axios';
import Loader from '@/components/ui/Loader/loader';

export function OrderFeedView() {
    const defaultOrders = [
        { id: '050', client: 'EXIST', status: 'Новая', date: '2025-04-15', articles: 20, sum: 20000, upl: '-' },
        { id: '123', client: 'EXIST', status: 'Новая', date: '2025-04-15', articles: 10, sum: 5000, upl: '-' },
        { id: '234', client: 'EXIST', status: 'Отправлен запрос на склад', date: '2025-04-15', articles: 2, sum: 3000, upl: '-' },
        { id: '534', client: 'EXIST', status: 'Сборка', date: '2025-04-15', articles: 3, sum: 4000, upl: '-' },
        { id: '601', client: 'EMEX', status: 'Новая', date: '2025-04-15', articles: 5, sum: 12000, upl: '-' },
        { id: '602', client: 'ZZAP', status: 'Новая', date: '2025-04-15', articles: 3, sum: 8000, upl: '-' },
        { id: '603', client: 'AUTODOC', status: 'Сборка', date: '2025-04-15', articles: 7, sum: 15000, upl: '-' }
    ];

    const [orders, setOrders] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>('Все');
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const router = useRouter();

    // Статусы заказов согласно документации
    const orderStatuses = [
        { id: 'all', name: 'Все' },
        { id: 'new', name: 'Новая' },
        { id: 'accepted', name: 'Принят' },
        { id: 'sent_to_warehouse', name: 'Отправлен на склад' },
        { id: 'sent_to_client', name: 'Отправлен клиенту' },
        { id: 'fulfilled', name: 'Выполнен' },
        { id: 'upd_sent', name: 'УПД отправлен' },
        { id: 'payment_received', name: 'Оплата получена' }
    ];

    useEffect(() => {
        const savedState = localStorage.getItem('orderFeedState');
        const savedOrders = localStorage.getItem('orders');

        // Инициализация дат с учетом часового пояса
        const now = new Date();
        const lastWeekStart = subDays(now, 7);
        
        // Приводим к UTC для унификации формата на всех серверах
        const formattedStartDate = format(lastWeekStart, 'yyyy-MM-dd');
        const formattedEndDate = format(now, 'yyyy-MM-dd');

        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                const { start, end, search, status, supplier } = parsed;
                
                // Проверяем, валидны ли даты
                const validStart = start && /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : formattedStartDate;
                const validEnd = end && /^\d{4}-\d{2}-\d{2}$/.test(end) ? end : formattedEndDate;
                
                setStartDate(validStart);
                setEndDate(validEnd);
                setSearchValue(search || '');
                setStatusFilter(status || 'Все');
                setSupplierFilter(supplier || null);
            } catch (e) {
                console.error('Error parsing saved state:', e);
                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);
            }
        } else {
            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
        }

        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (e) {
                console.error('Error parsing saved orders:', e);
            }
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
    }, [startDate, endDate, searchValue, statusFilter, supplierFilter]);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/orders/get_orders.php')
            .then(res => setOrders(res.data))
            .catch(err => console.error('Ошибка загрузки заказов:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        // Проверяем, является ли введенная дата валидной
        if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
            setStartDate(inputDate);
        } else {
            console.warn('Invalid date format for start date:', inputDate);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        // Проверяем, является ли введенная дата валидной
        if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
            setEndDate(inputDate);
        } else {
            console.warn('Invalid date format for end date:', inputDate);
        }
    };

    const viewOrderDetails = (id: string) => {
        router.push(`${DASHBOARD_PAGES.ORDERDETAILVIEW}?id=${id}`);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.order_id && order.order_id.toString().includes(searchValue)) ||
            (order.order_contragent && order.order_contragent.toString().toLowerCase().includes(searchValue.toLowerCase()));
        const matchesStatus = !statusFilter || statusFilter === 'Все';
        const matchesSupplier = !supplierFilter || order.order_contragent === supplierFilter;
        
        let matchesDateRange = true;
        if (startDate && endDate) {
            try {
                // Создаем даты без учета времени, только год-месяц-день
                const orderDateStr = order.date.split('T')[0]; // Берем только дату, отбрасываем время
                const orderDate = new Date(orderDateStr);
                
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                // Устанавливаем время начала дня для стартовой даты и конец дня для конечной даты
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                
                matchesDateRange = orderDate >= start && orderDate <= end;
            } catch (e) {
                console.error('Error comparing dates:', e);
                matchesDateRange = true;
            }
        }
        
        return matchesSearch && matchesStatus && matchesSupplier && matchesDateRange;
    });

    // Пагинация
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <div className="flex flex-col min-h-screen">
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <div className="flex flex-wrap items-center space-x-4 mb-4">
                            {orderStatuses.map(status => (
                                <Button
                                    key={status.id}
                                    onClick={() => setStatusFilter(status.name)}
                                    className={`px-4 py-2 ${statusFilter === status.name || (status.name === 'Все' && !statusFilter) ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded-md`}
                                >
                                    {status.name}
                                </Button>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center space-x-4">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md flex-1 bg-gray-700 text-white"
                                placeholder="Поиск по ID или клиенту"
                            />
                            <input
                                type="date"
                                value={startDate || ''}
                                onChange={handleStartDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                value={endDate || ''}
                                onChange={handleEndDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
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
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Создать новый заказ
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4 ">
                        <div className="flex-1 flex flex-col overflow-auto">
                            {loading ? (
                                <Loader />
                            ) : (
                                <div className="flex-1 overflow-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-xs text-center">id</th>
                                            <th className="px-6 py-3 text-xs text-center">Номер заказа</th>
                                            <th className="px-6 py-3 text-xs text-center">Клиент</th>
                                            <th className="px-6 py-3 text-xs text-center">Статус</th>
                                            <th className="px-6 py-3 text-xs text-center">Дата заказа</th>
                                            <th className="px-6 py-3 text-xs text-center">Кол-во артикулов</th>
                                            <th className="px-6 py-3 text-xs text-center">Сумма</th>
                                            <th className="px-6 py-3 text-xs text-center">Номер УПД</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {paginatedOrders.map((order) => (
                                            <tr key={order.order_id} onClick={() => viewOrderDetails(order.order_id)} className="hover:bg-gray-700 cursor-pointer">
                                                <td className="px-6 py-4 text-xs text-center">{order.order_id}</td>
                                                <td className="px-6 py-4 text-xs text-center">{order.order_number || '-'}</td>
                                                <td className="px-6 py-4 text-xs text-center">{order.order_contragent || '-'}</td>
                                                <td className="px-6 py-4 text-xs text-center">-</td>
                                                <td className="px-6 py-4 text-xs text-center">{order.order_add_date || '-'}</td>
                                                <td className="px-6 py-4 text-xs text-center">{order.products ? order.products.length : '-'}</td>
                                                <td className="px-6 py-4 text-xs text-center">-</td>
                                                <td className="px-6 py-4 text-xs text-center">-</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                            >
                                Предыдущая
                            </button>
                            <span className="text-sm text-gray-300">
                                Страница {currentPage} из {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                            >
                                Следующая
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
