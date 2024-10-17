'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/buttons/Button";

export function BlacklistView() {
    const [searchValue, setSearchValue] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null); // Для начала периода
    const [endDate, setEndDate] = useState<string | null>(null); // Для окончания периода

    interface Blacklist {
        [key: string]: Array<{ nomenclature: string; client: string; dateAdded: string }>;
    }

    const initialData: Blacklist = {
        emex: [
            { nomenclature: 'U45162534', client: 'emex', dateAdded: '2020-03-03' },
            { nomenclature: 'P45163564', client: 'emex', dateAdded: '2020-03-03' },
            { nomenclature: 'U45164564', client: 'emex', dateAdded: '2020-03-03' }
        ],
        exist: [
            { nomenclature: 'E45162534', client: 'exist', dateAdded: '2021-04-01' },
            { nomenclature: 'E45163564', client: 'exist', dateAdded: '2021-04-01' },
            { nomenclature: 'E45164564', client: 'exist', dateAdded: '2021-04-01' }
        ],
        zzap: [
            { nomenclature: 'Z45162534', client: 'zzap', dateAdded: '2022-05-15' },
            { nomenclature: 'Z45163564', client: 'zzap', dateAdded: '2022-05-15' },
            { nomenclature: 'Z45164564', client: 'zzap', dateAdded: '2022-05-15' }
        ],
        autodoc: [
            { nomenclature: 'A45162534', client: 'autodoc', dateAdded: '2023-06-10' },
            { nomenclature: 'A45163564', client: 'autodoc', dateAdded: '2023-06-10' },
            { nomenclature: 'A45164564', client: 'autodoc', dateAdded: '2023-06-10' }
        ]
    };

    const [blacklist, setBlacklist] = useState<Blacklist>(initialData);
    const [expandedFolders, setExpandedFolders] = useState<(keyof Blacklist)[]>([]); // Изменено

    const toggleFolder = (folder: keyof Blacklist) => { // Изменено
        setExpandedFolders(prev =>
            prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
        );
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value ? e.target.value : null);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value ? e.target.value : null);
    };

    const isWithinRange = (date: string) => {
        const dateToCheck = new Date(date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Если есть только дата начала или окончания
        if (start && !end) return dateToCheck >= start;
        if (!start && end) return dateToCheck <= end;

        // Если обе даты заданы
        if (start && end) return dateToCheck >= start && dateToCheck <= end;

        return true;
    };

    const filteredBlacklist = (list: any[]) => list.filter(item =>
        item.nomenclature.includes(searchValue) &&
        isWithinRange(item.dateAdded)
    );

    // @ts-ignore
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
                                placeholder="Дата начала"
                            />
                            <input
                                type="date"
                                value={endDate || ''}
                                onChange={handleEndDateChange}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                placeholder="Дата окончания"
                            />
                            <Button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Скачать шаблон
                            </Button>
                            <Button
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                            >
                                Загрузить
                            </Button>
                            <Button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                            >
                                Удалить из ЧС
                            </Button>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        {Object.keys(blacklist).map(folder => (
                            <div key={folder}>
                                <div
                                    className="cursor-pointer bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                    onClick={() => toggleFolder(folder)}
                                >
                                    {folder.toUpperCase()}
                                </div>
                                {expandedFolders.includes(folder) && (
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                <input type="checkbox" />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номенклатура</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Клиент</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата занесения в ЧС</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {filteredBlacklist(blacklist[folder]).map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input type="checkbox" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.nomenclature}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.client}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.dateAdded}</td>
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
