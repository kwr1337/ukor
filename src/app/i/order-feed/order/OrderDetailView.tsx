'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import * as cheerio from 'cheerio'

export function OrderDetailView() {
    const [orderItems, setOrderItems] = useState<Item[]>([]);
    const [rejectedItems, setRejectedItems] = useState<Item[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [statusUpdates, setStatusUpdates] = useState<{ status: string; time: string; date: string }[]>([
        { status: "Новая", time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }
    ]);
    const [backendData, setBackendData] = useState<Item[]>([]);
    const [comparisonResults, setComparisonResults] = useState<{ [key: string]: { fileQuantity: string; backendQuantity: string } }>({});

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);

            const newStatusUpdates = [
                ...statusUpdates,
                { status: "Отправлен запрос на склад", time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }
            ];
            setStatusUpdates(newStatusUpdates);

            const formData = new FormData();
            formData.append('files[]', selectedFile);

            try {
                const response = await fetch('https://ukor.isprogs.ru/modules/upload/upload_order_request_xls_file.php', {
                    method: 'POST',
                    body: formData,
                });

                const html = await response.text();
                parseHTML(html);

                const finalStatusUpdates = [
                    ...newStatusUpdates,
                    { status: "Пришел ответ от склада", time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }
                ];
                setStatusUpdates(finalStatusUpdates);

            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const parseHTML = (html: string) => {
        const $ = cheerio.load(html);

        const parseTableRows = (tableIndex: number) => {
            return $('table').eq(tableIndex).find('tr').slice(1).map((index, row) => {
                const columns = $(row).find('td').map((_, col) => $(col).text().trim()).get();
                if (columns.length > 0) {
                    return {
                        code: columns[0],
                        name: columns[1],
                        quantity: columns[2],
                        price: columns[3],
                        total: columns[4],
                        gtd: columns[5],
                        brand: columns[6],
                        cost: columns[7],
                        priceTag: columns[8],
                    };
                }
                return null;
            }).get().filter(item => item !== null);
        };

        const newOrderItems = parseTableRows(0) as Item[];
        const newRejectedItems = parseTableRows(1) as Item[];

        setOrderItems(newOrderItems);
        setRejectedItems(newRejectedItems);
    };


    // Функция для сохранения данных в LocalStorage
    const saveOrder = () => {
        const orderId = new Date().toISOString(); // Уникальный идентификатор заказа
        localStorage.setItem(`order_${orderId}`, JSON.stringify({
            orderItems,
            rejectedItems,
            statusUpdates
        }));
        alert('Данные сохранены успешно');
    };

    return (
        <div className="flex max-w-8xl w-full mx-auto space-x-8">
            <div className="flex-1 space-y-8">
                {/* Форма ввода */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    {/* Поля ввода */}
                    <div className="flex-1">
                        {/* ... остальные элементы */}
                        <div className="flex py-1">
                            <Button className="bg-primary text-white px-4 py-2 rounded-md">Выгрузить накладную</Button>
                        </div>

                        {/* Загрузка файла */}
                        <div className="flex py-1">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInput"
                            />
                            <Button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Выбрать файл и загрузить
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Таблицы с данными */}
                <div className="py-4">
                    <h2 className="text-xl font-medium mb-2">Состав заказа</h2>
                    <table className="min-w-full divide-y divide-gray-700 mt-2">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Заказ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование детали</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер ГТД</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Бренд</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Себе</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Прайс</th>
                        </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {orderItems.map(({code, name, quantity, price, total, gtd, brand, cost, priceTag}, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 text-xs">{code}</td>
                                <td className="px-6 py-4 text-xs">{name}</td>
                                <td className="px-6 py-4 text-xs">{quantity}</td>
                                <td className="px-6 py-4 text-xs">{price}</td>
                                <td className="px-6 py-4 text-xs">{total}</td>
                                <td className="px-6 py-4 text-xs">{gtd}</td>
                                <td className="px-6 py-4 text-xs">{brand}</td>
                                <td className="px-6 py-4 text-xs">{cost}</td>
                                <td className="px-6 py-4 text-xs">{priceTag}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="py-4">
                    <h2 className="text-xl font-medium mb-2">Отказ</h2>
                    <table className="min-w-full divide-y divide-gray-700 mt-2">
                        <thead className="bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Артикул</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кол-во</th>
                        </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {rejectedItems.map(({code, name}, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 text-xs">{code}</td>
                                <td className="px-6 py-4 text-xs">{name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="py-4 space-x-3">
                    <Button className="bg-primary text-white px-4 py-2 rounded-md" onClick={saveOrder}>Сохранить</Button>
                    <Button className="bg-gray-300 px-4 py-2 rounded-md">Сохранить как черновик</Button>
                    <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">Отправить на сборку</Button>
                    <Button className="bg-red-500 text-white px-4 py-2 rounded-md">Удалить</Button>
                </div>
            </div>

            {/* Статус заказа */}
            <div className="w-80 flex-shrink-0 space-y-4">
                <h2 className="font-semibold text-xl">Статус заказа</h2>
                <div className="border-l-2 border-gray-300 pl-4 space-y-2">
                    {statusUpdates.map((update, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${index === statusUpdates.length - 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                            <div className="flex flex-col">
                                <span>{update.status}</span>
                                <span className="text-xs text-gray-500">{update.time} | {update.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="bg-pink-500 text-white px-4 py-2 rounded">Запрос на снятие</Button>
            </div>
        </div>
    );
}
