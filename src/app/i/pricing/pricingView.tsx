'use client'

import React, { useState, useEffect } from 'react';

// Replace with your extracted data
const extractedData = [
    {
        "product_article": "A2205400717",
        "product_brand": "MERCEDES-BENZ",
        "product_name": "Датчик износа тормозных колодок передний MERCEDES W221 W220 W212 W211 W203 W204",
        "product_min_cost": 10,
        "product_cost": 20,
        "parse_data": [
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 12,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 12:03"
            },
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 13,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 23:03"
            }
        ]
    },
    {
        "product_article": "jbj740",
        "product_brand": "TRW",
        "product_name": "Опора шаровая, передняя нижняя",
        "product_min_cost": 0,
        "product_cost": 3456789,
        "parse_data": [
            {
                "parse_name": "TRW",
                "parse_price": 1633,
                "parse_amount": 5,
                "parse_delivery": 2,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 20:01"
            },
            {
                "parse_name": "TRW",
                "parse_price": 1633,
                "parse_amount": 8,
                "parse_delivery": 3,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 20:01"
            },
            {
                "parse_name": "TRW",
                "parse_price": 1666,
                "parse_amount": 2,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 20:00"
            }
        ]
    },
    {
        "product_article": "509001594AADYJ",
        "product_brand": "Chery",
        "product_name": "Боковина кузова правая m1dfl2",
        "product_min_cost": 500,
        "product_cost": 230000,
        "parse_data": [
            {
                "parse_name": "Chery",
                "parse_price": 230195,
                "parse_amount": 6,
                "parse_delivery": 6,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 10:01"
            },
            {
                "parse_name": "Chery",
                "parse_price": 230195,
                "parse_amount": 6,
                "parse_delivery": 7,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 10:01"
            },
            {
                "parse_name": "Chery",
                "parse_price": 241673,
                "parse_amount": 5,
                "parse_delivery": 6,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 19:01"
            }
        ]
    },
    {
        "product_article": "03D198819C",
        "product_brand": "VAG",
        "product_name": "Фильтр масляный",
        "product_min_cost": 176,
        "product_cost": 167,
        "parse_data": [
            {
                "parse_name": "VAG",
                "parse_price": 1299,
                "parse_amount": 46,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 11:01"
            },
            {
                "parse_name": "VAG",
                "parse_price": 1299,
                "parse_amount": 46,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 11:01"
            },
            {
                "parse_name": "VAG",
                "parse_price": 2035,
                "parse_amount": 22,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 11:01"
            }
        ]
    },
    {
        "product_article": "28113I1G000",
        "product_brand": "Hyundai",
        "product_name": "Фильтр воздушный",
        "product_min_cost": 287,
        "product_cost": 273,
        "parse_data": [
            {
                "parse_name": "Hyundai/Kia",
                "parse_price": 236,
                "parse_amount": 80,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 19:01"
            },
            {
                "parse_name": "Hyundai/Kia",
                "parse_price": 236,
                "parse_amount": 80,
                "parse_delivery": 6,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 23:01"
            },
            {
                "parse_name": "Hyundai/Kia",
                "parse_price": 961,
                "parse_amount": 8,
                "parse_delivery": 4,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 15:01"
            }
        ]
    },
    {
        "product_article": "24124",
        "product_brand": "214214",
        "product_name": "234324124",
        "product_min_cost": 123214,
        "product_cost": 214124,
        "parse_data": [
            {
                "parse_name": "Gross",
                "parse_price": 1478,
                "parse_amount": 39,
                "parse_delivery": 7,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 15:02"
            },
            {
                "parse_name": "Gross",
                "parse_price": 1478,
                "parse_amount": 39,
                "parse_delivery": 7,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 15:02"
            },
            {
                "parse_name": "Gross",
                "parse_price": 1550,
                "parse_amount": 87,
                "parse_delivery": 6,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 15:01"
            }
        ]
    },
    {
        "product_article": "A2205400717",
        "product_brand": "MERCEDES-BENZ",
        "product_name": "авыа",
        "product_min_cost": 213342,
        "product_cost": 324231,
        "parse_data": [
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 12,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 23:03"
            },
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 13,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 23:03"
            }
        ]
    },
    {
        "product_article": "A2205400717",
        "product_brand": "Hyundai",
        "product_name": "Тест",
        "product_min_cost": 1231,
        "product_cost": 3435,
        "parse_data": [
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 12,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 23:03"
            },
            {
                "parse_name": "Mercedes",
                "parse_price": 3896,
                "parse_amount": 18,
                "parse_delivery": 13,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 23:03"
            }
        ]
    },
    {
        "product_article": "28113L1000",
        "product_brand": "Kia",
        "product_name": "Фильтр воздушный",
        "product_min_cost": 100,
        "product_cost": 1000,
        "parse_data": [
            {
                "parse_name": "Kap",
                "parse_price": 975,
                "parse_amount": 1,
                "parse_delivery": 7,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 04:03"
            },
            {
                "parse_name": "Kap",
                "parse_price": 975,
                "parse_amount": 1,
                "parse_delivery": 9,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 04:03"
            },
            {
                "parse_name": "Kap",
                "parse_price": 1038,
                "parse_amount": 1,
                "parse_delivery": 7,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 04:03"
            }
        ]
    },
    {
        "product_article": "04E115561H",
        "product_brand": "VAG",
        "product_name": "Фильтр масляный",
        "product_min_cost": 281,
        "product_cost": 442,
        "parse_data": [
            {
                "parse_name": "VAG",
                "parse_price": 800,
                "parse_amount": 7,
                "parse_delivery": 5,
                "item_delivery_rate": "green",
                "parse_datetime": "18.07.2024 09:00"
            },
            {
                "parse_name": "VAG",
                "parse_price": 1100,
                "parse_amount": 1,
                "parse_delivery": 0,
                "item_delivery_rate": "yellow",
                "parse_datetime": "18.07.2024 10:00"
            },
            {
                "parse_name": "VAG",
                "parse_price": 2443,
                "parse_amount": 189,
                "parse_delivery": 1,
                "item_delivery_rate": "red",
                "parse_datetime": "18.07.2024 11:00"
            }
        ]
    }
];

interface ParseData {
    parse_name: string;
    parse_price: number;
    parse_amount: number;
    parse_delivery: number;
    item_delivery_rate: string;
    parse_datetime: string;
}

interface Item {
    product_article: string;
    product_brand: string;
    product_name: string;
    product_min_cost: number;
    product_cost: number;
    parse_data: ParseData[];
}

export function PricingView() {
    const [data, setData] = useState<Item[]>([]);

    useEffect(() => {
        setData(extractedData);
    }, []);

    return (
        <div>
            <h1 className='text-3xl font-medium'>Ценообразование</h1>
            <div className='my-3 h-0.5 bg-border w-full' />
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <table className="min-w-full divide-y divide-gray-700 mt-2">
                    <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border " rowSpan={2}>Артикул</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border" rowSpan={2}>Бренд</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border" rowSpan={2}>Наименование</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border" rowSpan={2}>Себестоимость</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border" rowSpan={2}>Цена</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border" colSpan={6}>Exist.ru</th>
                    </tr>
                    <tr>
                        <th className="px-6 py-3 text-сenter text-xs font-medium text-gray-400 uppercase tracking-wider border">Наименование поставщика</th>
                        <th className="px-6 py-3 text-сenter text-xs font-medium text-gray-400 uppercase tracking-wider border">Цена на сайте</th>
                        <th className="px-6 py-3 text-сenter text-xs font-medium text-gray-400 uppercase tracking-wider border">Кол-во на сайте</th>
                        <th className="px-6 py-3 text-сenter text-xs font-medium text-gray-400 uppercase tracking-wider border">Срок доставки</th>
                        <th className="px-6 py-3 text-сenter text-xs font-medium text-gray-400 uppercase tracking-wider border">Дата и время синхронизации</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((item, index) => {
                        return (
                            item.parse_data.map((parseItem, w) => (
                                <tr key={`${index}-${w}`}>
                                    {w === 0 && (
                                        <>
                                            <td rowSpan={item.parse_data.length}
                                                className="px-6 py-4 text-center text-xs">{item.product_article}</td>
                                            <td rowSpan={item.parse_data.length}
                                                className="px-6 py-4  text-center text-xs">{item.product_brand}</td>
                                            <td rowSpan={item.parse_data.length}
                                                className="px-6 py-4 text-center text-xs">{item.product_name}</td>
                                            <td rowSpan={item.parse_data.length}
                                                className="px-6 py-4 text-center text-xs">{item.product_min_cost}</td>
                                            <td rowSpan={item.parse_data.length}
                                                className="px-6 py-4 text-center text-xs">{item.product_cost}</td>
                                        </>
                                    )}
                                    <td className="px-6 py-4  text-center text-xs">{parseItem.parse_name}</td>
                                    <td className={`px-6 py-4 text-center text-xs ${parseItem.parse_price > item.product_cost ? 'nice-price' : 'bad-price'}`}>
                                        {parseItem.parse_price}
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs">{parseItem.parse_amount}</td>
                                    <td className="px-6 py-4 text-center text-xs">{parseItem.parse_delivery}</td>
                                    <td className="px-6 py-4 text-center text-xs">{parseItem.parse_datetime}</td>
                                </tr>
                            ))
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
