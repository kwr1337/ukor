'use client'

import React, {useState} from 'react';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Button} from "@/components/ui/buttons/Button";
import {format} from "date-fns";

export function SummaryView() {
    const ordersAmount = 1324563; // Сумма заказов
    const profit = 1324563; // Прибыль
    const profitability = 200; // Рентабельность в процентах
    const margin = 300; // Маржинальность в процентах
    const orderChange = 324563; // Изменение суммы заказов от прошлого периода

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState('');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null);
    };

    const data = [
        {name: 'Янв', orders: 4000, profit: 2400, amt: 2400},
        {name: 'Фев', orders: 3000, profit: 1398, amt: 2210},
        {name: 'Мар', orders: 2000, profit: 9800, amt: 2290},
        {name: 'Апр', orders: 2780, profit: 3908, amt: 2000},
        {name: 'Май', orders: 1890, profit: 4800, amt: 2181},
        {name: 'Июн', orders: 2390, profit: 3800, amt: 2500},
        {name: 'Июл', orders: 3490, profit: 4300, amt: 2100},
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
                    <h1 className='text-3xl font-medium'>Сводка</h1>
                    <div className="flex mb-4 space-x-2" style={mf}>
                        <input
                            type="date"
                            value={selectedDate || ''}
                            onChange={handleDateChange}
                            className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                        />
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                        >
                            <option value="">Все клиенты</option>

                        </select>
                    </div>
                </div>
                <div className='my-3 h-0.5 bg-border w-full'/>
            </div>
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden bg-gray-800 text-white p-6">
                    <div className="flex justify-between items-center">
                    <div>
                            <h2 className="text-xl font-bold mb-2">Заказы</h2>
                            <p className="text-2xl font-semibold">{ordersAmount} руб.</p>
                            <p className="text-green-500">+{orderChange} руб.</p>
                            <p className="text-gray-400">От прошлого периода</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Прибыль</h2>
                            <p className="text-2xl font-semibold">{profit} руб.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Рентабельность</h2>
                            <p className="text-2xl font-semibold">{profitability}%</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Маржинальность</h2>
                            <p className="text-2xl font-semibold">{margin}%</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Обновить
                        </button>
                    </div>
                    <div className="mt-8">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="orders" stroke="#8884d8"/>
                                <Line type="monotone" dataKey="profit" stroke="#82ca9d"/>
                                <CartesianGrid stroke="#ccc"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
