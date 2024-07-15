'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/buttons/Button";

export function NomenclatureView() {



    const data = [
        {
            manufacturer: "HYUNDAI",
            partNumber: "230402E000",
            manufacturerSteels: "KIA/HYUNDAI/MOBIS",
            partNumberSteels: "230402E000",
            name: "Кольца поршневые (STD)",
            link1: "43864382",
            link2: "43864382",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "HYUNDAI",
            partNumber: "244713C100",
            manufacturerSteels: "KIA/HYUNDAI/MOBIS",
            partNumberSteels: "24471-3C100",
            name: "Планка успокоитель цепи ГРМ",
            link1: "43863630",
            link2: "43863630",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "HYUNDAI",
            partNumber: "248103C200",
            manufacturerSteels: "KIA/HYUNDAI/MOBIS",
            partNumberSteels: "24810-3C200",
            name: "Планка направляющая цепи ГРМ",
            link1: "43863599",
            link2: "43863599",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "HYUNDAI",
            partNumber: "31112F9000",
            manufacturerSteels: "KIA/HYUNDAI/MOBIS",
            partNumberSteels: "31112F9000",
            name: "Фильтр топливный",
            link1: "43866085",
            link2: "43866085",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "UKORAUTO",
            partNumber: "U0406005",
            manufacturerSteels: "UKORAUTO",
            partNumberSteels: "U0406005",
            name: "Болт гбц",
            link1: "43863167",
            link2: "43863167",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "UKORAUTO",
            partNumber: "U0521034L",
            manufacturerSteels: "UKORAUTO",
            partNumberSteels: "U0521034L",
            name: "Фара левая",
            link1: "43864030",
            link2: "43864030",
            unit: "шт",
            registrationDate: "01.01.2024"
        },
        {
            manufacturer: "UKORAUTO",
            partNumber: "U1304302",
            manufacturerSteels: "UKORAUTO",
            partNumberSteels: "U1304302",
            name: "Реле",
            link1: "43864897",
            link2: "43864897",
            unit: "шт",
            registrationDate: "01.01.2024"
        }
    ];


    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCBrand, setSelectedCBrand] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // @ts-ignore
    const uniqueClients = [...new Set(data.map(data => data.manufacturer))];

    const filteredOrders = data.filter(data =>
        data.manufacturer.includes(searchValue) &&
        (!selectedCBrand || data.manufacturer === selectedCBrand)
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
                    <h1 className='text-3xl font-medium'>Номенклатура</h1>
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Производитель
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">№
                                    Детали
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Производитель
                                    Steels
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">№
                                    Детали Steels
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ссылка
                                    1
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ссылка
                                    2
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Единица
                                    измерения
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата
                                    регистрации в системе
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredOrders.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.manufacturer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.partNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.manufacturerSteels}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.partNumberSteels}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.link1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.link2}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.registrationDate}</td>
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
