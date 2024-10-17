'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";

export function CounterPartiesView() {

    // Пример данных контрагентов
    const [data, setData] = useState([
        {
            id: '12311',
            type: 'Склад',
            name: 'ООО Склад',
            INN: '123215412345',
            email: 'sklad@mail.ru',
            phone: '890102345671',
        },
        {
            id: '23412',
            type: 'Клиент',
            name: 'ООО Автодок',
            INN: '123215412345',
            email: 'auto@mail.ru',
            phone: '',
        },
        {
            id: '34513',
            type: 'Поставщик',
            name: 'ООО Экзист',
            INN: '543216789012',
            email: 'sales@exist.ru, support@exist.ru',
            phone: '890505678912',
        }
    ]);

    const [newCounterparty, setNewCounterparty] = useState({
        type: '',
        name: '',
        INN: '',
        emails: '',
        phone: ''
    });

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Фильтр данных контрагентов
    const filteredOrders = data.filter(order =>
        order.id.includes(searchValue) &&
        (!statusFilter || order.type === statusFilter)
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const handleAddCounterparty = () => {
        // Преобразование строк emails в массив
        const emailList = newCounterparty.emails.split(',').map(email => email.trim());

        // Привязка нового контрагента к данным
        const newCounterpartyEntry = {
            id: (data.length + 1).toString(),
            type: newCounterparty.type,
            name: newCounterparty.name,
            INN: newCounterparty.INN,
            email: emailList.join(', '),  // Преобразуем обратно в строку
            phone: newCounterparty.phone
        };

        // Обновляем состояние с новыми данными
        setData([...data, newCounterpartyEntry]);
        setNewCounterparty({ type: '', name: '', INN: '', emails: '', phone: '' });
    };

    const router = useRouter();

    const handleCreate = () => {
        router.push(DASHBOARD_PAGES.COUNTERPARTYVIEW);
    };

    const mf = {
        marginLeft: "20%"
    };
    const f = {
        display: "flex"
    };

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className='text-3xl font-medium'>Контрагенты</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button onClick={() => setStatusFilter(null)} className="bg-primary text-white px-4 py-2 rounded">Все</Button>
                        <Button onClick={() => setStatusFilter('Склад')} className="bg-primary text-white px-4 py-2 rounded">Склад</Button>
                        <Button onClick={() => setStatusFilter('Клиент')} className="bg-primary text-white px-4 py-2 rounded">Клиент</Button>
                        <Button onClick={() => setStatusFilter('Поставщик')} className="bg-gray-200 px-4 py-2 rounded">Поставщик</Button>
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
                            <Button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Создать
                            </Button>
                        </div>
                    </div>

                    {/* Таблица контрагентов */}
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">id</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тип</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ИНН</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Почта</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Телефон</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((data) => (
                                <tr key={data.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.INN}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{data.phone}</td>
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
