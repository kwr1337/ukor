'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

export function SupplyView() {
	const [orderNumber, setOrderNumber] = useState('')
	const [returnNumber, setReturnNumber] = useState('')
	const [client, setClient] = useState('')
	const [orderDate, setOrderDate] = useState('')
	const [returnDate, setReturnDate] = useState('')
	const [searchValue, setSearchValue] = useState('')

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
			productionStatus: 'Китай',
			date: '2024-03-03'
		},
		{
			code: 'U0517119',
			name: 'Решетка радиатора',
			quantity: 1,
			price: 4708.2,
			total: 4708.2,
			gtd: '10702070/070723/3277360/23',
			brand: 'UKORAUTO',
			weight: 1.87,
			digitalCode: 156,
			productionStatus: 'Китай',
			date: '2024-03-04'
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
			productionStatus: 'Китай',
			date: '2024-03-05'
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
			productionStatus: 'Китай',
			date: '2024-03-06'
		},
		{
			code: 'U1310014',
			name: 'Выключатель (замок) зажигания',
			quantity: 1,
			price: 1292.1,
			total: 1292.1,
			gtd: '10702070/050523/3181311/17',
			brand: 'UKORAUTO',
			weight: 0,
			digitalCode: 156,
			productionStatus: 'Китай',
			date: '2024-03-07'
		}
	]

	const statusUpdates = [
		{ status: 'Новая', time: '9:15', date: '03.03.2024' },
		{ status: 'Запланирована', time: '9:30', date: '03.03.2024' },
		{ status: 'Выполнена', time: '16:00', date: '04.03.2024' }
	]

	const [filteredItems, setFilteredItems] = useState(rejectedItems)

	const handleDateFilter = () => {
		const filtered = rejectedItems.filter(item => {
			const itemDate = new Date(item.date)
			const startDate = new Date(orderDate)
			const endDate = new Date(returnDate)
			return itemDate >= startDate && itemDate <= endDate
		})
		setFilteredItems(filtered)
	}

	return (
		<div>
			<div>
				<div style={{ display: 'flex' }}>
					<h1 className='text-3xl font-medium'>Поставка</h1>
					<div
						className='flex mb-4 space-x-2'
						style={{ marginLeft: '30%' }}
					>
						<Button className='bg-primary text-white px-4 py-2 rounded-md'>
							Скачать шаблон
						</Button>
						<Button className='bg-gray-300 px-4 py-2 rounded-md'>
							Загрузить файл с товарами
						</Button>
					</div>
				</div>
				<div className='my-3 h-0.5 bg-border w-full' />
			</div>
			<div className='max-w-8xl w-full mx-auto space-y-1'>
				<div className='shadow-md rounded-lg overflow-hidden'>
					<div className='px-6 py-4'>
						<div className='flex items-center space-x-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Номер поставки
								</label>
								<input
									type='text'
									value={orderNumber}
									onChange={e => setOrderNumber(e.target.value)}
									placeholder='Номер поставки'
									readOnly
									className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none bg-gray-200 text-black'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Номер возврата
								</label>
								<input
									type='text'
									value={returnNumber}
									onChange={e => setReturnNumber(e.target.value)}
									placeholder='Номер возврата'
									readOnly
									className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none bg-gray-200 text-black'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Поставщик
								</label>
								<select
									value={client}
									onChange={e => setClient(e.target.value)}
									className='px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								>
									<option value=''>Поставщик</option>
									{/* Добавьте дополнительные опции здесь */}
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Страна
								</label>
								<select
									value={client}
									onChange={e => setClient(e.target.value)}
									className='px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								>
									<option value=''>Страна</option>
									{/* Добавьте дополнительные опции здесь */}
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Склад
								</label>
								<select
									value={client}
									onChange={e => setClient(e.target.value)}
									className='px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								>
									<option value=''>Склад</option>
									{/* Добавьте дополнительные опции здесь */}
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Дата заказа
								</label>
								<input
									type='date'
									value={orderDate}
									onChange={e => {
										setOrderDate(e.target.value)
										handleDateFilter()
									}}
									className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Дата возврата
								</label>
								<input
									type='date'
									value={returnDate}
									onChange={e => {
										setReturnDate(e.target.value)
										handleDateFilter()
									}}
									className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								/>
							</div>
						</div>

						<div className='flex mt-4'>
							<div className='flex-1'>
								<label className='block text-sm font-medium text-gray-700'>
									Поиск
								</label>
								<input
									type='text'
									value={searchValue}
									onChange={e => {
										setSearchValue(e.target.value)
										handleDateFilter() // Опционально триггерить фильтрацию при изменении поиска
									}}
									placeholder='Поиск'
									className='w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
								/>
							</div>
						</div>
					</div>

					<div className='overflow-x-auto px-6 py-4'>
						<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
							{/* Таблица */}
							<div className='col-span-1 md:col-span-4'>
								<div className='py-4'>
									<div className='overflow-auto'>
										<table className='divide-y divide-gray-700 min-w-full max-w-screen-md'>
											<thead className='bg-gray-800'>
											<tr>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Код
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Наименование
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Количество
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Цена руб
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Сумма руб
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Номер ГТД
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Бренд
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Вес, кг
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Цифровой код
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Статус происхождения
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
													Статус происхождения
												</th>
											</tr>
											</thead>
											<tbody className='bg-gray-800 divide-y divide-gray-700'>
											{filteredItems.map((item, index) => (
												<tr key={index}>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.code}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.name}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.quantity}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.price}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.total}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.gtd}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.brand}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.weight}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.digitalCode}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.productionStatus}
													</td>
													<td className='px-6 py-4 whitespace-wrap'>
														{item.date}
													</td>
												</tr>
											))}
											</tbody>
										</table>
									</div>
								</div>
							</div>

							{/* Блок со статусом заказа */}
							<div className='col-span-1 md:col-span-1'>
								<h2 className='font-semibold text-xl'>Статус заказа</h2>
								<div className='border-l-2 border-gray-300 pl-4 space-y-2'>
									{statusUpdates.map((update, index) => (
										<div
											key={index}
											className='flex items-center space-x-2'
										>
											<div
												className={`w-4 h-4 rounded-full ${index === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}
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

								<div className='flex-col px-1 py-3'>
									<Button className='bg-primary px-4 py-2 rounded-md'>
										Обновить статус
									</Button>
									<Button className='bg-gray-300 mt-1 px-4 py-2 rounded-md'>
										Отменить заказ
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
