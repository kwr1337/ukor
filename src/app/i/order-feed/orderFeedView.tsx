'use client';

import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import axios from 'axios';
import Loader from '@/components/ui/Loader/loader';
import Tooltip from '@mui/material/Tooltip';

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
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [totalPages, setTotalPages] = useState(1);
    const ordersPerPage = 10;

    const router = useRouter();

    // Функция для преобразования статуса из бэкенда в читаемый формат
    const getReadableStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'new': 'Новая',
            'accepted': 'Принят',
            'sent_to_warehouse': 'Отправлен на склад',
            'sent_to_client': 'Отправлен клиенту',
            'fulfilled': 'Выполнен',
            'upd_sent': 'УПД отправлен',
            'payment_received': 'Оплата получена'
        };
        return statusMap[status] || status;
    };

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

    // Функция для сортировки
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortedOrders = (ordersToSort: any[]) => {
        if (!sortColumn) return ordersToSort;

        return [...ordersToSort].sort((a, b) => {
            let aValue = a[sortColumn];
            let bValue = b[sortColumn];

            // Специальная обработка для дат
            if (sortColumn === 'order_add_date') {
                try {
                    // Преобразуем даты в объекты Date
                    const [dayA, monthA, yearA] = (a.order_add_date || '').split('.');
                    const [dayB, monthB, yearB] = (b.order_add_date || '').split('.');
                    
                    const dateA = new Date(
                        `${yearA}-${monthA}-${dayA}T${a.order_add_time || '00:00'}`
                    );
                    
                    const dateB = new Date(
                        `${yearB}-${monthB}-${dayB}T${b.order_add_time || '00:00'}`
                    );

                    return sortDirection === 'asc' 
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                } catch (error) {
                    console.error('Error parsing date:', error);
                    return 0;
                }
            }

            // Специальная обработка для числовых значений
            if (sortColumn === 'total_sum' || sortColumn === 'products_length') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }

            if (aValue === bValue) return 0;
            
            const compareResult = aValue > bValue ? 1 : -1;
            return sortDirection === 'asc' ? compareResult : -compareResult;
        });
    };

    useEffect(() => {
        const savedState = localStorage.getItem('orderFeedState');

        // Инициализация дат с учетом часового пояса
        const now = new Date();
        const lastWeekStart = subDays(now, 7);
        
        const formattedStartDate = format(lastWeekStart, 'yyyy-MM-dd');
        const formattedEndDate = format(now, 'yyyy-MM-dd');

        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                const { start, end, search, status, supplier } = parsed;
                
                setStartDate(start || formattedStartDate);
                setEndDate(end || formattedEndDate);
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
        setStartDate(inputDate);
        setCurrentPage(1); // Сброс на первую страницу при изменении фильтра
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        setEndDate(inputDate);
        setCurrentPage(1); // Сброс на первую страницу при изменении фильтра
    };

    const viewOrderDetails = (id: string) => {
        router.push(`${DASHBOARD_PAGES.ORDERDETAILVIEW}?id=${id}`);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.order_id && order.order_id.toString().includes(searchValue)) ||
            (order.order_contragent_name && order.order_contragent_name.toString().toLowerCase().includes(searchValue.toLowerCase()));
        
        const matchesStatus = !statusFilter || statusFilter === 'Все' || getReadableStatus(order.order_status) === statusFilter;
        const matchesSupplier = !supplierFilter || order.order_contragent_name === supplierFilter;
        
        let matchesDateRange = true;
        if (startDate && endDate) {
            try {
                // Преобразуем дату заказа в объект Date
                const [orderDay, orderMonth, orderYear] = (order.order_add_date || '').split('.');
                const orderDate = new Date(
                    `${orderYear}-${orderMonth}-${orderDay}T${order.order_add_time || '00:00'}`
                );

                // Преобразуем даты фильтра в объекты Date
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                // Устанавливаем время начала и конца дня
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

    // Получаем уникальный список поставщиков из данных
    const uniqueSuppliers = React.useMemo(() => {
        const suppliers = new Set<string>();
        orders.forEach(order => {
            if (order.order_contragent_name) {
                suppliers.add(order.order_contragent_name);
            }
        });
        return Array.from(suppliers).sort();
    }, [orders]);

    // Пагинация
    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    useEffect(() => {
        const totalItems = filteredOrders.length;
        const calculatedTotalPages = Math.ceil(totalItems / ordersPerPage);
        setTotalPages(calculatedTotalPages);
        if (currentPage > calculatedTotalPages) {
            setCurrentPage(1);
        }
    }, [filteredOrders, currentPage, ordersPerPage]);

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
                                    className={`px-4 py-2 ${statusFilter === status.name ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded-md`}
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
                                {uniqueSuppliers.map(supplier => (
                                    <option key={supplier} value={supplier}>
                                        {supplier}
                                    </option>
                                ))}
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
                                            <th 
                                                onClick={() => handleSort('order_id')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по ID" arrow>
                                                    <span>ID {sortColumn === 'order_id' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th 
                                                onClick={() => handleSort('order_contragent_name')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по клиенту" arrow>
                                                    <span>Клиент {sortColumn === 'order_contragent_name' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th 
                                                onClick={() => handleSort('order_status')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по статусу" arrow>
                                                    <span>Статус {sortColumn === 'order_status' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th 
                                                onClick={() => handleSort('order_add_date')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по дате" arrow>
                                                    <span>Дата заказа {sortColumn === 'order_add_date' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th 
                                                onClick={() => handleSort('products_length')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по количеству артикулов" arrow>
                                                    <span>Кол-во артикулов {sortColumn === 'products_length' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th 
                                                onClick={() => handleSort('total_sum')}
                                                className="px-6 py-3 text-xs text-center cursor-pointer hover:bg-gray-600"
                                            >
                                                <Tooltip title="Сортировка по сумме" arrow>
                                                    <span>Сумма {sortColumn === 'total_sum' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="px-6 py-3 text-xs text-center">Номер УПД</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {getSortedOrders(filteredOrders)
                                            .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                                            .map((order) => {
                                            // Считаем сумму заказа по всем товарам
                                            let sum = '-';
                                            let currency = '';
                                            if (order.products && Array.isArray(order.products) && order.products.length > 0) {
                                                const totalSum = order.products.reduce((acc: number, p: any) => {
                                                    const price = parseFloat(p.order_product_price) || 0;
                                                    const amount = parseFloat(p.order_product_amount) || 0;
                                                    return acc + (price * amount);
                                                }, 0);
                                                sum = totalSum.toFixed(2);
                                                currency = order.products[0]?.order_product_currency || '';
                                            }
                                            return (
                                                <tr key={order.order_id} onClick={() => viewOrderDetails(order.order_id)} className="hover:bg-gray-700 cursor-pointer">
                                                    <td className="px-6 py-4 text-xs text-center">{order.order_id}</td>
                                                    <td className="px-6 py-4 text-xs text-center">{order.order_contragent_name || '-'}</td>
                                                    <td className="px-6 py-4 text-xs text-center">{getReadableStatus(order.order_status) || '-'}</td>
                                                    <td className="px-6 py-4 text-xs text-center">{(order.order_add_date && order.order_add_time) ? `${order.order_add_date} ${order.order_add_time}` : '-'}</td>
                                                    <td className="px-6 py-4 text-xs text-center">{order.products ? order.products.length : '-'}</td>
                                                    <td className="px-6 py-4 text-xs text-center">{sum !== '-' ? `${sum} ${currency}` : '-'}</td>
                                                    <td className="px-6 py-4 text-xs text-center">-</td>
                                                </tr>
                                            );
                                        })}
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
