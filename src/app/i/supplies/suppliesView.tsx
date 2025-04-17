'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";

export function SuppliesView() {

    const supplies = [
        { orderNumber: '567665', creationDate: '2024-10-15', itemQuantity: 205, acceptedQuantity: 0, warehouse: 'price3179', plannedDate: '2024-02-17', actualDate: '', status: 'запланирована', supplier: 'ИП Иванов', country: 'Россия' },
        { orderNumber: '567664', creationDate: '2024-10-02', itemQuantity: 306, acceptedQuantity: 306, warehouse: 'price3309', plannedDate: '2024-02-05', actualDate: '2024-02-05', status: 'принято', supplier: 'ООО Колесо', country: 'Китай' }
    ];

    const [searchValue, setSearchValue] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const filteredOrders = supplies.filter(data => {
        const matchesSearch = data.orderNumber.includes(searchValue);
        const matchesDateRange =
            (!startDate || new Date(data.plannedDate) >= new Date(startDate)) &&
            (!endDate || new Date(data.plannedDate) <= new Date(endDate));

        return matchesSearch && matchesDateRange;
    });

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const router = useRouter();

    const rout = () => {
        router.push(DASHBOARD_PAGES.SUPPLYVIEW);
    };

    return (
        <div>
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
                                placeholder="Начальная дата"
                            />
                            <input
                                type="date"
                                value={endDate || ''}
                                onChange={handleEndDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                placeholder="Конечная дата"
                            />
                            <Button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                onClick={rout}
                            >
                                Создать поставку
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер поставки</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата создания</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во товаров, шт</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Принято, шт</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Склад</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Плановая дата</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Фактическая дата</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Поставщик</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Страна</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderNumber}>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.creationDate}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.itemQuantity}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.acceptedQuantity}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.warehouse}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.plannedDate}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.actualDate}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.status}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.supplier}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{order.country}</td>
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
