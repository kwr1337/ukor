'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function PricingView() {



    const data = [
        {
            article: "UCH9C243298",
            brand: "UKOR AUTO",
            nomenclature: "Переключатель подрулевой левый",
            seb: 800,
            emexPrice: "1200/1300",
            existPrice: "1225/1350",
            autodocPrice: "1200/1350",
            zzapPrice: "1300/1350",
        }
    ];


    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCBrand, setSelectedCBrand] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // @ts-ignore
    const uniqueClients = [...new Set(data.map(data => data.brand))];

    const filteredOrders = data.filter(data =>
        data.article.includes(searchValue) &&
        (!selectedCBrand || data.brand === selectedCBrand)
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const mf = {
        marginLeft: "20%"
    }
    const f = {
        display: "flex"
    }

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className='text-3xl font-medium'>Ценообразование</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button  className="bg-primary text-white px-4 py-2 rounded">Cкачать пустой шаблон</Button>
                        <Button  className="bg-gray-200 px-4 py-2 rounded">Скачать шаблон по выбранным</Button>
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
                            <select
                                value={selectedCBrand}
                                onChange={(e) => setSelectedCBrand(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            >
                                <option value="">Все бренды</option>
                                {uniqueClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </select>
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Загрузить
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-700 mt-4">
                            <thead className="bg-gray-700">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номенклатура
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себес
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">emex
                                    цена уст./на сайте
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">exist
                                    цена уст./на сайте
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">autodoc
                                    цена уст./на сайте
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">zzap
                                    цена уст./на сайте
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.article}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.nomenclature}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.seb}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.emexPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.existPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.autodocPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.zzapPrice}</td>
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
