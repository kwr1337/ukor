'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function MailView() {

    const data = [
        {
            email: "UCH9C243298",
            subject: "UKOR AUTO",
            massage: "Переключатель подрулевой левый",
            date: 800,
        }
    ];

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // const filteredOrders = data.filter(data =>
    //     data.id.includes(searchValue) &&
    //     (!selectedDate || order.date === selectedDate) &&
    //     (!statusFilter || order.status === statusFilter)
    // );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const mf = {
        marginLeft: "25%"
    }
    const f = {
        display: "flex"
    }

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className='text-3xl font-medium'>Почта</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button onClick={() => setStatusFilter('Новая')} className="bg-primary text-white px-4 py-2 rounded">Входящие</Button>
                        <Button onClick={() => setStatusFilter('Сборка')} className="bg-gray-200 px-4 py-2 rounded">Отправленные</Button>
                        <Button onClick={() => setStatusFilter('Отправлен запрос на склад')} className="bg-gray-200 px-4 py-2 rounded">Удаленные</Button>
                        <Button onClick={() => setStatusFilter('Завершены')} className="bg-gray-200 px-4 py-2 rounded">Спам</Button>
                    </div>
                </div>
                <div className='my-3 h-0.5 bg-border w-full' />
            </div>
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Почта</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тема</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сообщение</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата сообщения</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {data.map((data) => (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.massage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.date}</td>
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
