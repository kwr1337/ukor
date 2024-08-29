'use client'

import axios from 'axios'
import * as cheerio from 'cheerio'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/buttons/Button'
import Loader from "@/components/ui/Loader/loader";


interface LeftOvers {
	name: string
	articul: string
	brand: string
	count: string
	price: string
	warehouse: string
}

export function LeftoversView() {
	const [leftOversItems, setLeftOversItems] = useState<LeftOvers[]>([])
	const [searchValue, setSearchValue] = useState('')
	const [statusFilter, setStatusFilter] = useState<string | null>(null)
	const [selectedBrand, setSelectedBrand] = useState<string>('')
	const [loading, setLoading] = useState(true) // Добавьте состояние загрузки

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true) // Устанавливаем загрузку в true до начала запроса
			try {
				const response = await axios.get('http://147.45.153.94/front/table1.php')
				const $ = cheerio.load(response.data)

				const data: LeftOvers[] = []
				$('table tbody tr').each((index, element) => {
					if (index === 0) return

					const name = $(element).find('td:nth-child(1)').text().trim()
					const articul = $(element).find('td:nth-child(2)').text().trim()
					const brand = $(element).find('td:nth-child(3)').text().trim()
					const count = $(element).find('td:nth-child(4)').text().trim()
					const price = $(element).find('td:nth-child(5)').text().trim()
					const warehouse = $(element).find('td:nth-child(6)').text().trim()

					data.push({ name, articul, brand, count, price, warehouse })
				})

				setLeftOversItems(data)
			} catch (error) {
				console.error('Ошибка при получении данных:', error)
			} finally {
				setLoading(false) // Устанавливаем загрузку в false после завершения запроса
			}
		}

		fetchData()
	}, [])

	const filterItems = (items: LeftOvers[]) => {
		if (!statusFilter) return items
		return items.filter(item => item.warehouse === statusFilter)
	}

	const filterByBrand = (items: LeftOvers[]) => {
		if (!selectedBrand) return items
		return items.filter(item => item.brand === selectedBrand)
	}

	const searchItems = (items: LeftOvers[]) => {
		if (!searchValue) return items
		return items.filter(item =>
			item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.articul.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.brand.toLowerCase().includes(searchValue.toLowerCase())
		)
	}

	const uniqueBrands = [...new Set(leftOversItems.map(item => item.brand))]

	const filteredItems = filterItems(leftOversItems)
	const brandFilteredItems = filterByBrand(filteredItems)
	const searchedItems = searchItems(brandFilteredItems)

	const mf = {
		marginLeft: "30%"
	};
	const f = {
		display: "flex"
	};

	return (
		<div>
			<div>
				<div className='flex'>
					<h1 className='text-3xl font-medium'>Остатки</h1>
					<div
						className='flex mb-4 space-x-2'
						style={mf}
					>
						<Button
							onClick={() => setStatusFilter('Общий склад')}
							className='bg-primary text-white px-4 py-2 rounded'
						>
							Общий склад
						</Button>
						<Button
							onClick={() => setStatusFilter('Наш склад')}
							className='bg-gray-200 px-4 py-2 rounded'
						>
							Наш склад
						</Button>
					</div>
				</div>
				<div className='my-3 h-0.5 bg-border w-full' />
			</div>
			<div>
				<div className='flex items-center space-x-4 px-6 py-4'>
					<input
						type='text'
						value={searchValue}
						onChange={e => setSearchValue(e.target.value)}
						className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white'
						placeholder='Введите значение для поиска'
					/>
					<select
						value={selectedBrand}
						onChange={(e) => setSelectedBrand(e.target.value)}
						className="px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					>
						<option value="">Все бренды</option>
						{uniqueBrands.map(brand => (
							<option key={brand} value={brand}>{brand}</option>
						))}
					</select>
				</div>

				{loading ? (
					<Loader />
				) : (
					<div className='px-6 py-4'>
						<table className='min-w-full divide-y divide-gray-700 mt-2'>
							<thead className='bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Наименование
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Артикул
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Бренд
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Количество
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Цена
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Склад
								</th>
							</tr>
							</thead>
							<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{searchedItems.length === 0 ? (
								<tr>
									<td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
										Нет данных для отображения
									</td>
								</tr>
							) : (
								searchedItems.map(item => (
									<tr key={item.articul}>
										<td className='px-6 py-4 whitespace-nowrap'>{item.name}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{item.articul}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.brand}</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.count}</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.price}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{item.warehouse}
										</td>
									</tr>
								))
							)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
