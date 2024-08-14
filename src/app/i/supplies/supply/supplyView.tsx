'use client'

import React, {useState} from 'react';
import {Button} from '@/components/ui/buttons/Button';


export function SupplyView() {
    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const rejectedItems = [
        {
            code: 'U0508027',
            name: 'Брызговик двигателя (правый)',
            quantity: 1,
            price: 893.46,
            total: 893.46,
            gtd: '10702070/041123/3448134/2',
            brand: 'UKORAUTO',
            weight: 0.7,
            digitalCode: 156,
            productionStatus: 'Китай'
        },
        {
            code: 'U0517119',
            name: 'Решетка радиатора',
            quantity: 1,
            price: 4708.20,
            total: 4708.20,
            gtd: '10702070/070723/3277360/23',
            brand: 'UKORAUTO',
            weight: 1.87,
            digitalCode: 156,
            productionStatus: 'Китай'
        },
        {
            code: 'U0902066',
            name: 'Патрубок системы охлаждения',
            quantity: 1,
            price: 474.96,
            total: 474.96,
            gtd: '10702070/310723/3311483/1',
            brand: 'UKORAUTO',
            weight: 0,
            digitalCode: 156,
            productionStatus: 'Китай'
        },
        {
            code: 'U1002331',
            name: 'Форсунка стеклоомывателя',
            quantity: 3,
            price: 216.78,
            total: 650.34,
            gtd: '10702070/120423/3142845/43',
            brand: 'UKORAUTO',
            weight: 0.015,
            digitalCode: 156,
            productionStatus: 'Китай'
        },
        {
            code: 'U1310014',
            name: 'Выключатель (замок) зажигания',
            quantity: 1,
            price: 1292.10,
            total: 1292.10,
            gtd: '10702070/050523/3181311/17',
            brand: 'UKORAUTO',
            weight: 0,
            digitalCode: 156,
            productionStatus: 'Китай'
        }
    ];

    const statusUpdates = [
        {status: "Новая", time: "9:15", date: "03.03.2024"},
        {status: "Запланирована", time: "9:30", date: "03.03.2024"},
        {status: "Выполнена", time: "16:00", date: "04.03.2024"}
    ];

    const mf = {
        marginLeft: "30%"
    }
    const f = {
        display: "flex"
    }

    return (
        <div>
            <div>
                <div style={f}>
                    <h1 className='text-3xl font-medium'>Поставка</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <Button className="bg-primary text-white px-4 py-2 rounded-md">Скачать шаблон</Button>
                        <Button className="bg-gray-300 px-4 py-2 rounded-md">Загрузить файл с товарами</Button>
                    </div>
                </div>
                <div className='my-3 h-0.5 bg-border w-full'/>
            </div>
            <div className="max-w-8xl w-full mx-auto space-y-1">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">

                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Номер поставки</label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    placeholder="Номер поставки"
                                    className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Номер возврата</label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    placeholder="Номер возврата"
                                    className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Поставщик</label>
                                <select
                                    value={client}
                                    className="px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                >
                                    <option value="">Поставщик</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Страна</label>
                                <select
                                    value={client}
                                    className="px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                >
                                    <option value="">Страна</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Склад</label>
                                <select
                                    value={client}
                                    className="px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                >
                                    <option value="">Склад</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Дата заказа</label>
                                <input
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Дата возврата </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Поиск</label>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white"
                                    placeholder="Поиск"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <div className="py-4">
                                    <h2 className="text-xl font-medium mb-2">Возврат</h2>
                                    <table className="min-w-full divide-y divide-gray-700 mt-2">
                                        <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование
                                                детали
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена
                                                руб
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма
                                                руб
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер
                                                ГТД
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Вес,
                                                кг
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цифровой
                                                код
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус
                                                происхождения
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {rejectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.total}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.gtd}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.digitalCode}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.productionStatus}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="py-4 space-x-3">
                                    <Button className="bg-primary text-white px-4 py-2 rounded-md">Создать
                                        поставку</Button>
                                    <Button className="bg-gray-300 px-4 py-2 rounded-md">Сохранить как черновик</Button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4 md:w-3/3">
                                <h2 className="font-semibold text-xl">Статус заказа</h2>
                                <div className="border-l-2 border-gray-300 pl-4 space-y-2">
                                    {statusUpdates.map((update, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div
                                                className={`w-4 h-4 rounded-full ${index === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}/>
                                            <div className="flex flex-col">
                                                <span>{update.status}</span>
                                                <span
                                                    className="text-xs text-gray-500">{update.time} | {update.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
