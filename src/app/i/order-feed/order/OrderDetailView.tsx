'use client'

import * as cheerio from 'cheerio'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

import { Button } from '@/components/ui/buttons/Button'
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '@/config/api.config';

interface Item {
	code: string
	name: string
	quantity: string
	price: string
	total: string
	gtd: string
	brand: string
	cost: string
	priceTag: string
	currency: string
	expectedDate: string
	barcode: string // Штрихкод
	orderId?: string // Номер заказа в ИС
}

const suppliers = [
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
]

export function OrderDetailView() {
	const [orderItems, setOrderItems] = useState<Item[]>([])
	const [rejectedItems, setRejectedItems] = useState<Item[]>([])
	const [sortConfig, setSortConfig] = useState<{ key: keyof Item | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })
	const [file, setFile] = useState<File | null>(null)
	const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
	const [orderNumber, setOrderNumber] = useState<string>('')
	const [orderTotal, setOrderTotal] = useState<number>(0)
	const [orderArticlesCount, setOrderArticlesCount] = useState<number>(0)
	const [warehouseStock, setWarehouseStock] = useState<string>('В наличии')
	const [expectedDate, setExpectedDate] = useState<string>(new Date().toISOString().split('T')[0])
	const [shipping, setShipping] = useState<string>('Самовывоз')
	const [currency, setCurrency] = useState<string>('RUB')
	const [barcode, setBarcode] = useState<string>('')
	const [inStockCount, setInStockCount] = useState<number>(0)
	const [outOfStockCount, setOutOfStockCount] = useState<number>(0)
	const [clientName, setClientName] = useState<string>('ООО Экзист')
	const [upd, setUpd] = useState<string>('2132332')
	const [totalSum, setTotalSum] = useState<string>('288 000')
	const [createdBy, setCreatedBy] = useState<string>('Система')
	const [order, setOrder] = useState<any | null>(null)
	const [leftovers, setLeftovers] = useState<any[]>([])
	const [loadingLeftovers, setLoadingLeftovers] = useState<boolean>(true)
	
	const searchParams = useSearchParams()
	const orderId = searchParams?.get('id')
	
	const [statusUpdates, setStatusUpdates] = useState<
		{ status: string; time: string; date: string }[]
	>([
		{
			status: 'Новая',
			time: new Date().toLocaleTimeString(),
			date: new Date().toLocaleDateString()
		}
	])

	const router = useRouter()

	// Все возможные статусы заказа согласно документации
	const allStatuses = [
		'Новая',
		'Принят',
		'Отправлен на склад',
		'УПД отправлен',
		'Отправлен клиенту',
		'Выполнен',
		'Оплата получена'
	]

	useEffect(() => {
		if (orderId) {
			axios.get('/api/orders/get_orders.php')
				.then(res => {
					const found = res.data.find((o: any) => o.order_id === orderId);
					setOrder(found || null);
				})
				.catch(err => console.error('Ошибка загрузки заказа:', err));
		}
	}, [orderId]);

	useEffect(() => {
		// Подсчет количества товаров в наличии и не в наличии
		let inStock = 0;
		let outOfStock = 0;
		
		orderItems.forEach(item => {
			if (item.quantity && parseInt(item.quantity) > 0) {
				inStock++;
			} else {
				outOfStock++;
			}
		});
		
		setInStockCount(inStock);
		setOutOfStockCount(outOfStock);
	}, [orderItems]);

	// Загрузка остатков склада
	useEffect(() => {
		const fetchLeftovers = async () => {
			try {
				setLoadingLeftovers(true);
				const response = await axios.get(`${API_BASE_URL}/api/warehouses/get_warehouses.php`);
				// Собираем все nomenclature из всех складов
				const nomenclature = Array.isArray(response.data)
					? response.data.flatMap((warehouse: any) => warehouse.nomenclature || [])
					: [];
				setLeftovers(nomenclature);
			} catch (error) {
				console.error('Ошибка при получении остатков:', error);
			} finally {
				setLoadingLeftovers(false);
			}
		};
		fetchLeftovers();
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0])
		}
	}

	const parseFile = async () => {
		if (!file) return

		const reader = new FileReader()
		reader.onload = async e => {
			const text = e.target?.result as string
			const $ = cheerio.load(text)

			const items: Item[] = []
			$('tr').each((i, el) => {
				if (i === 0) return // Skip header row

				const tds = $(el).find('td')
				if (tds.length >= 5) {
					const qty = $(tds[2]).text().trim();
					const price = $(tds[3]).text().trim();
					const total = (parseInt(qty) * parseFloat(price)).toString();
					
					const item: Item = {
						orderId: orderId || '',
						code: $(tds[0]).text().trim(),
						name: $(tds[1]).text().trim(),
						quantity: qty,
						price: price,
						total: total,
						gtd: tds.length > 5 ? $(tds[5]).text().trim() : '',
						brand: 'Бренд ' + Math.floor(Math.random() * 10),
						cost: (parseFloat(price) * 0.7).toFixed(2),
						priceTag: (parseFloat(price) * 1.2).toFixed(2),
						currency: 'RUB',
						expectedDate: new Date().toISOString().split('T')[0],
						barcode: '123' + Math.floor(Math.random() * 1000000000)
					}
					items.push(item)
				}
			})

			setOrderItems(items)
		}
		reader.readAsText(file)
	}

	const saveOrder = () => {
		// Здесь должна быть логика сохранения заказа
		alert('Заказ сохранен')
	}

	const deleteOrder = () => {
		// Здесь должна быть логика удаления заказа
		router.push(DASHBOARD_PAGES.ORDER_FEED)
	}

	const updateOrderStatus = (newStatus: string) => {
		setStatusUpdates([
			...statusUpdates,
			{
				status: newStatus,
				time: new Date().toLocaleTimeString(),
				date: new Date().toLocaleDateString()
			}
		])
	}

	// Функция для сохранения записи в историю изменений
	const saveHistoryRecord = (field: string, type: string, oldValue: string, newValue: string) => {
		const now = new Date();
		const historyItem = {
			date: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
			time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
			type: type,
			field: field,
			oldValue: oldValue,
			newValue: newValue,
			user: 'Текущий пользователь',
			position: 'Менеджер'
		};

		const historyKey = `order_history_${orderId}`;
		const storedHistory = localStorage.getItem(historyKey);
		let history = [];

		if (storedHistory) {
			try {
				history = JSON.parse(storedHistory);
			} catch (e) {
				console.error('Error parsing history', e);
			}
		}

		history.push(historyItem);
		localStorage.setItem(historyKey, JSON.stringify(history));
	};

	// При изменении статуса заказа
	const handleStatusChange = (newStatus: string) => {
		// Проверяем, что новый статус отличается от текущего
		if (newStatus !== statusUpdates[statusUpdates.length - 1].status) {
			const oldStatus = statusUpdates[statusUpdates.length - 1].status;
			updateOrderStatus(newStatus);
			
			// Сохраняем запись в историю только если у нас есть orderId
			if (orderId) {
				saveHistoryRecord('Статус заказа', 'Изменение статуса', oldStatus, newStatus);
			}
		}
	};

	if (!order || loadingLeftovers) return <div>Загрузка...</div>;

	// Данные для блока информации
	const info = {
		id: order.order_id || '-',
		sum: order.order_total || '-',
		client: order.order_contragent || '-',
		upl: order.upd_number || '-',
		articles: order.products ? order.products.length : '-',
		created: order.created_by || '-',
	};

	const productsWithStock = (order.products || []).map((product: any) => {
		const article = (product.order_product_article || '').replace(/\s/g, '');
		const found = leftovers.find((item: any) => (item.product_article || '').replace(/\s/g, '') === article);
		const orderPrice = parseFloat(product.order_product_price) || 0;
		const orderAmount = parseFloat(product.order_product_amount) || 0;
		return {
			...product,
			sklad_status: found ? 'В наличии' : 'Отказ',
			sklad_cost: found ? found.product_price : '-',
			price: product.order_product_price || '-',
			amount: product.order_product_amount || '-',
			total: orderPrice * orderAmount,
			currency: product.order_product_currency || '-',
		};
	});

	type ProductWithStock = typeof productsWithStock[number];
	const totalOrderSum = productsWithStock.reduce((sum: number, p: ProductWithStock) => sum + (typeof p.total === 'number' ? p.total : 0), 0);
	const orderCurrency = productsWithStock[0]?.currency || '-';

	return (
		<div className='p-4'>
			<div className='flex flex-col md:flex-row gap-6'>
				<div className='flex-1 space-y-6'>
					{/* Информация о заказе */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Информация о заказе</h2>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-gray-400'>Id заказа:</p>
								<p>{info.id}</p>
							</div>
							<div>
								<p className='text-gray-400'>Сумма:</p>
								<p>{totalOrderSum} {orderCurrency}</p>
							</div>
							<div>
								<p className='text-gray-400'>Клиент:</p>
								<p>{info.client}</p>
							</div>
							<div>
								<p className='text-gray-400'>Номер УПД:</p>
								<p>{info.upl}</p>
							</div>
							<div>
								<p className='text-gray-400'>Кол-во артикулов:</p>
								<p>{info.articles}</p>
							</div>
							<div>
								<p className='text-gray-400'>Создан:</p>
								<p>{info.created}</p>
							</div>
						</div>
					</div>

					{/* Таблица товаров - Состав заказа */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Состав заказа (На складе {productsWithStock.filter((p: ProductWithStock) => p.sklad_status === 'В наличии').length})</h2>
						<div className="overflow-x-auto max-w-full">
							<table className='min-w-full divide-y divide-gray-700 table-fixed'>
								<thead className='bg-gray-700'>
								<tr>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Заказ</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Наименование</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Артикул</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Бренд</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Кол-во</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Цена</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Остаток</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Валюта</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Ожид. дата</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Штрихкод</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Номер ГТД</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Себест.</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Прайс</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>Итого</th>
								</tr>
								</thead>
								<tbody className='bg-gray-800 divide-y divide-gray-700'>
								{productsWithStock.map((product: ProductWithStock, index: number) => (
									<tr key={index}>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_id || '-'}</td>
										<td className='px-2 py-2 text-xs max-w-[150px] truncate'>{product.order_product_name || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_product_article || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_product_brand || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.amount}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.price}</td>
										<td className={`px-2 py-2 text-xs whitespace-nowrap ${product.sklad_status === 'В наличии' ? 'text-green-400' : 'text-red-400'}`}>{product.sklad_status}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.currency}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_expected_date || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_product_bar_code || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.order_product_gtd || '-'}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.sklad_cost}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.price}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{product.total}</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Отказы */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Отказы ({outOfStockCount})</h2>
						<div className="overflow-x-auto max-w-full">
							<table className='min-w-full divide-y divide-gray-700 table-fixed'>
								<thead className='bg-gray-700'>
								<tr>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Заказ
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Наименование
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Артикул
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Бренд
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Кол-во
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Ожид. дата
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Остаток
									</th>
									<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
										Штрихкод
									</th>
								</tr>
								</thead>
								<tbody className='bg-gray-800 divide-y divide-gray-700'>
								{rejectedItems.map((item, index) => (
									<tr key={index}>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.orderId || orderNumber}</td>
										<td className='px-2 py-2 text-xs max-w-[150px] truncate'>{item.name}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.code}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.brand}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.quantity}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.expectedDate}</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>Отсутствует</td>
										<td className='px-2 py-2 text-xs whitespace-nowrap'>{item.barcode}</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Правая колонка: статус заказа + загрузка файла */}
				<div className='w-80 flex-shrink-0 space-y-4'>
					<h2 className='font-semibold text-xl'>Статус заказа</h2>
					<div className='border-l-2 border-gray-300 pl-4 space-y-2'>
						{statusUpdates.map((update, index) => (
							<div
								key={index}
								className='flex items-center space-x-2'
							>
								<div
									className={`w-4 h-4 rounded-full ${index === statusUpdates.length - 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
								/>
								<div className='flex flex-col'>
									<span>{update.status}</span>
									<span className='text-xs text-gray-500'>
										{update.time} | {update.date}
									</span>
								</div>
							</div>
						))}
					</div>
					
					{/* Кнопки изменения статуса */}
					<div className='space-y-2'>
						<h3 className='font-medium'>Изменить статус:</h3>
						{(() => {
							// Текущий статус
							const currentStatus = statusUpdates[statusUpdates.length - 1].status;
							
							// Определяем следующий статус в последовательности
							let nextStatus: string | null = null;
							
							switch(currentStatus) {
								case 'Новая':
									nextStatus = 'Принят';
									break;
								case 'Принят':
									nextStatus = 'Отправлен на склад';
									break;
								case 'Отправлен на склад':
									nextStatus = 'Отправлен клиенту';
									break;
								case 'Отправлен клиенту':
									nextStatus = 'Выполнен';
									break;
								case 'Выполнен':
									nextStatus = 'УПД отправлен';
									break;
								case 'УПД отправлен':
									nextStatus = 'Оплата получена';
									break;
								case 'Оплата получена':
									nextStatus = null;
									break;
								default:
									nextStatus = null;
							}
							
							// Если есть следующий статус, показываем кнопку
							if (nextStatus) {
								return (
									<Button
										className='bg-blue-500 text-white px-4 py-2 rounded-md w-full'
										onClick={() => handleStatusChange(nextStatus!)}
									>
										{nextStatus}
									</Button>
								);
							} else {
								return null;
							}
						})()}
					</div>
					
					{/* Загрузка файла */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Загрузка заказа</h2>
						<div className='flex flex-col space-y-4'>
							<input
								type='file'
								onChange={handleFileChange}
								className='bg-gray-700 rounded p-2'
							/>
							<Button onClick={parseFile} disabled={!file}>
								Загрузить файл
							</Button>
						</div>
					</div>

					<Button
						className='hover:bg-green-500 text-white px-4 py-2 rounded-md w-full'
						onClick={saveOrder}
					>
						Сохранить
					</Button>
					{/* <Button className='bg-gray-300 px-4 py-2 rounded-md w-full'>
						Сохранить как черновик
					</Button> */}
					<Button className='hover:bg-red-500 text-white px-4 py-2 rounded-md w-full mr-1' onClick={() => router.push(`${DASHBOARD_PAGES.ORDER_FEED}`)}>
						Отмена
					</Button>
					<Button className='hover:bg-red-500 text-white px-4 py-2 rounded-md w-full' onClick={deleteOrder}>
						Удалить
					</Button>
					
					{/* Кнопка перехода к истории изменений */}
					<Button 
						className='bg-gray-600 text-white px-4 py-2 rounded-md w-full'
						onClick={() => router.push(`${DASHBOARD_PAGES.ORDER_FEED}/history/${orderNumber}`)}
					>
						История изменений
					</Button>
				</div>
			</div>
		</div>
	)
}
