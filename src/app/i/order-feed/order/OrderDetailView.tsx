'use client'

import * as cheerio from 'cheerio'
import React, { useState, useEffect } from 'react'
// Удаляем импорт useSearchParams
// import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/buttons/Button'
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useRouter } from "next/navigation";

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
}

// Добавляем интерфейс для props
interface OrderDetailViewProps {
  orderId?: string | null;
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

// Модифицируем компонент, чтобы принимать orderId через props
export function OrderDetailView({ orderId }: OrderDetailViewProps) {
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
	
	// Удаляем получение searchParams
	// const searchParams = useSearchParams()
	// const orderId = searchParams.get('id')
	
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
		'На сборке',
		'Отправлен на склад',
		'УПД отправлен',
		'Отправлен клиенту',
		'Завершен',
		'Выполнен',
		'Оплата получена'
	]

	useEffect(() => {
		// Если есть ID заказа, загружаем данные заказа
		if (orderId) {
			// Здесь должен быть запрос к API для получения данных заказа
			// Для примера используем моковые данные
			setOrderNumber(orderId)
			setOrderTotal(Math.floor(Math.random() * 50000) + 5000)
			setOrderArticlesCount(Math.floor(Math.random() * 20) + 1)
			setBarcode('123456789012')
			
			// Генерируем историю статусов
			const mockStatusHistory = [
				{
					status: 'Новая',
					time: '10:00:00',
					date: '01.10.2024'
				}
			]
			
			// Добавляем случайное количество статусов
			const statusCount = Math.floor(Math.random() * 3) + 1
			for (let i = 0; i < statusCount; i++) {
				const statusIndex = Math.min(i + 1, allStatuses.length - 1)
				mockStatusHistory.push({
					status: allStatuses[statusIndex],
					time: `${10 + i}:${Math.floor(Math.random() * 60)}:00`,
					date: `0${i + 1}.10.2024`
				})
			}
			
			setStatusUpdates(mockStatusHistory)
		}
	}, [orderId])

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
					const item: Item = {
						code: $(tds[0]).text().trim(),
						name: $(tds[1]).text().trim(),
						quantity: $(tds[2]).text().trim(),
						price: $(tds[3]).text().trim(),
						total: $(tds[4]).text().trim(),
						gtd: tds.length > 5 ? $(tds[5]).text().trim() : '',
						brand: 'Бренд ' + Math.floor(Math.random() * 10),
						cost: '',
						priceTag: '',
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

	return (
		<div className='p-4'>
			<div className='flex flex-col md:flex-row gap-6'>
				<div className='flex-1 space-y-6'>
					{/* Информация о заказе */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Информация о заказе</h2>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-gray-400'>Входящий номер заказа:</p>
								<p>{orderNumber || 'Новый заказ'}</p>
							</div>
							<div>
								<p className='text-gray-400'>Количество:</p>
								<p>{orderArticlesCount}</p>
							</div>
							<div>
								<p className='text-gray-400'>Остаток на складах:</p>
								<p>{warehouseStock}</p>
							</div>
							<div>
								<p className='text-gray-400'>Валюта:</p>
								<select 
									className='bg-gray-700 rounded p-1 w-full'
									value={currency}
									onChange={e => setCurrency(e.target.value)}
								>
									<option value='RUB'>RUB</option>
									<option value='USD'>USD</option>
									<option value='EUR'>EUR</option>
								</select>
							</div>
							<div>
								<p className='text-gray-400'>Ожидаемая дата:</p>
								<input 
									type='date' 
									className='bg-gray-700 rounded p-1 w-full'
									value={expectedDate}
									onChange={e => setExpectedDate(e.target.value)}
								/>
							</div>
							<div>
								<p className='text-gray-400'>Штрихкод:</p>
								<input 
									type='text' 
									className='bg-gray-700 rounded p-1 w-full'
									value={barcode}
									onChange={e => setBarcode(e.target.value)}
								/>
							</div>
							<div>
								<p className='text-gray-400'>Итого сумма:</p>
								<p>{orderTotal} {currency}</p>
							</div>
						</div>
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

					{/* Таблица товаров - Состав заказа */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Состав заказа</h2>
						<table className='min-w-full divide-y divide-gray-700'>
							<thead className='bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Входящий номер заказа
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Количество
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Остаток на складах
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Валюта
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Ожидаемая дата
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Штрихкод
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Итого сумма
								</th>
							</tr>
							</thead>
							<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{orderItems.map((item, index) => (
								<tr key={index}>
									<td className='px-6 py-4 text-xs'>{item.code}</td>
									<td className='px-6 py-4 text-xs'>{item.quantity}</td>
									<td className='px-6 py-4 text-xs'>В наличии</td>
									<td className='px-6 py-4 text-xs'>{item.currency}</td>
									<td className='px-6 py-4 text-xs'>{item.expectedDate}</td>
									<td className='px-6 py-4 text-xs'>{item.barcode}</td>
									<td className='px-6 py-4 text-xs'>{item.total}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>

					{/* Отказы */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Отказы</h2>
						<table className='min-w-full divide-y divide-gray-700'>
							<thead className='bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Входящий номер заказа
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Наименование
								</th>
							</tr>
							</thead>
							<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{rejectedItems.map(({code, name}, index) => (
								<tr key={index}>
									<td className='px-6 py-4 text-xs'>{code}</td>
									<td className='px-6 py-4 text-xs'>{name}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
					
					{/* Дополнительные поля */}
					<div className='bg-gray-800 rounded-lg p-4 shadow-md'>
						<h2 className='font-semibold text-xl mb-4'>Дополнительная информация</h2>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-gray-400'>Бренд:</p>
								<select 
									className='bg-gray-700 rounded p-1 w-full'
								>
									<option value=''>Все бренды</option>
									<option value='brand1'>Бренд 1</option>
									<option value='brand2'>Бренд 2</option>
									<option value='brand3'>Бренд 3</option>
								</select>
							</div>
							<div>
								<p className='text-gray-400'>Ожидаемая дата:</p>
								<input 
									type='date' 
									className='bg-gray-700 rounded p-1 w-full'
									value={expectedDate}
									onChange={e => setExpectedDate(e.target.value)}
								/>
							</div>
							<div>
								<p className='text-gray-400'>Остаток на складах:</p>
								<select 
									className='bg-gray-700 rounded p-1 w-full'
									value={warehouseStock}
									onChange={e => setWarehouseStock(e.target.value)}
								>
									<option value='В наличии'>В наличии</option>
									<option value='Отсутствует'>Отсутствует</option>
									<option value='Ожидается'>Ожидается</option>
								</select>
							</div>
							<div>
								<p className='text-gray-400'>Штрихкод:</p>
								<input 
									type='text' 
									className='bg-gray-700 rounded p-1 w-full'
									value={barcode}
									onChange={e => setBarcode(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Статус заказа */}
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
						{allStatuses.map((status, index) => {
							// Показываем только следующий возможный статус
							const currentStatusIndex = allStatuses.indexOf(statusUpdates[statusUpdates.length - 1].status)
							if (index === currentStatusIndex + 1) {
								return (
									<Button
										key={status}
										className='bg-blue-500 text-white px-4 py-2 rounded-md w-full'
										onClick={() => updateOrderStatus(status)}
									>
										{status}
									</Button>
								)
							}
							return null
						})}
					</div>
					
					<Button
						className='hover:bg-green-500 text-white px-4 py-2 rounded-md w-full'
						onClick={saveOrder}
					>
						Сохранить
					</Button>
					<Button className='bg-gray-300 px-4 py-2 rounded-md w-full'>
						Сохранить как черновик
					</Button>
					<Button className='hover:bg-red-500 text-white px-4 py-2 rounded-md w-full mr-1' onClick={() => router.push(`${DASHBOARD_PAGES.ORDER_FEED}`)}>
						Отмена
					</Button>
					<Button className='hover:bg-red-500 text-white px-4 py-2 rounded-md w-full' onClick={deleteOrder}>
						Удалить
					</Button>
					
					{/* История изменений */}
					<div className='mt-8'>
						<h3 className='font-medium mb-2'>История изменений:</h3>
						<div className='bg-gray-700 p-3 rounded-lg text-sm'>
							{statusUpdates.map((update, index) => (
								<div key={index} className='mb-2 pb-2 border-b border-gray-600 last:border-0'>
									<div className='font-medium'>{update.status}</div>
									<div className='text-gray-400'>{update.date} в {update.time}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
