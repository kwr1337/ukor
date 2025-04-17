'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function EmployeesView() {

    const data = [
        {
            FIO: 'Петрова Павел',
            post: 'Менеджр по заказам',
            email: 'sklad@mail.ru',
            phone: '890102345628',
        },
        {
            FIO: 'Иванов Иван',
            post: 'Менеджр по ценообразованию',
            email: 'sklad@mail.ru',
            phone: '890102345671',
        },

    ];

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const filteredOrders = data.filter(order =>
        order.FIO.includes(searchValue)
    );


    const mf = {
        marginLeft: "30%"
    }
    const f = {
        display: "flex"
    }

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
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Добавить
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ФИО</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Должность</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Почта</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Телефон</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((data) => (
                                <tr key={data.FIO}>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{data.FIO}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{data.post}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{data.email}</td>
                                    <td className="px-6 py-4 text-xs whitespace-nowrap">{data.phone}</td>
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
