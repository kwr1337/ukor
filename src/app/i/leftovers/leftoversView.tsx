'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/buttons/Button'
import Loader from "@/components/ui/Loader/loader";
import productsData from './products.json'

interface LeftOvers {
	product_id: string
	product_article: string
	product_name: string
	product_price: string
	product_amount: string
	product_brand: string
	product_update_date:string
	warehouse: string
}
export function LeftoversView() {
	const [leftOversItems, setLeftOversItems] = useState<LeftOvers[]>([])
	const [searchValue, setSearchValue] = useState('')
	const [statusFilter, setStatusFilter] = useState<string >('')
	const [selectedBrand, setSelectedBrand] = useState<string>('')

	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 100

	 useEffect(() => {
		const fetchData = async () => {
	 		setLoading(true)
	 		try {
	 			// URL изменен для получения JSON данных
	 			const response = await axios.get('http://147.45.153.94/new_age/products.php')
	 			const data = response.data

	 			// Устанавливаем полученные данные
	 			setLeftOversItems(data)
	 		} catch (error) {
	 			console.error('Ошибка при получении данных:', error)
	 		} finally {
	 			setLoading(false)
	 		}
	 	}

	 	fetchData()
	 }, [])

	// useEffect(() => {
	// 	// Имитируем загрузку данных с бэка
	// 	setLoading(true)
	// 	setTimeout(() => {
	// 		// Используем данные из products.json
	// 		const data: LeftOvers[] = productsData.map((item: any) => ({
	// 			product_id: item.product_id,
	// 			product_name: item.product_name,
	// 			product_article: item.product_article,
	// 			product_brand: item.product_brand,
	// 			product_amount: item.product_amount,
	// 			product_price: item.product_price,
	// 			product_update_date: item.product_update_date,
	// 			warehouse: item.product_cross || 'Unknown Warehouse',
	// 		}));
	// 		setLeftOversItems(data)
	// 		setLoading(false)
	// 	}, 1000) // Задержка для имитации загрузки
	// }, [])

	const filterItems = (items: LeftOvers[]) => {
		if (!statusFilter) return items
		return items.filter(item => item.warehouse === statusFilter)
	}

	const filterByBrand = (items: LeftOvers[]) => {
		if (!selectedBrand) return items
		return items.filter(item => item.product_brand === selectedBrand)
	}

	const searchItems = (items: LeftOvers[]) => {
		if (!searchValue) return items
		return items.filter(item =>
			item.product_name.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.product_article.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.product_brand.toLowerCase().includes(searchValue.toLowerCase())
		)
	}

	const uniqueBrands = Array.from(new Set(leftOversItems.map(item => item.product_brand)))

	const filteredItems = filterItems(leftOversItems)
	const brandFilteredItems = filterByBrand(filteredItems)
	const searchedItems = searchItems(brandFilteredItems)

	// Пагинация
	const totalPages = Math.ceil(searchedItems.length / itemsPerPage)
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = searchedItems.slice(indexOfFirstItem, indexOfLastItem)

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(prevPage => prevPage + 1)
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(prevPage => prevPage - 1)
		}
	}

	return (
		<div>
			<div>
				<div className='flex'>
					<h1 className='text-3xl font-medium'>Склады</h1>
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
						placeholder='Введите наименование или артикул для поиска'
					/>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
					>
						<option value="">Все склады</option>
						<option value="Общий склад">Общий склад</option>
						<option value="Наш склад">Наш склад</option>
					</select>

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
									Дата обновления
								</th>
							</tr>
							</thead>
							<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{currentItems.length === 0 ? (
								<tr>
									<td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
										Нет данных для отображения
									</td>
								</tr>
							) : (
								currentItems.map(item => (
									<tr key={item.product_article}>
										<td className='px-6 py-4 whitespace-nowrap'>{item.product_name}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{item.product_article}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.product_brand}</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.product_amount}</td>
										<td className='px-6 py-4 whitespace-nowrap'>{item.product_price}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{item.product_update_date}
										</td>
									</tr>
								))
							)}
							</tbody>
						</table>
						{/* Пагинация */}
						<div className='flex justify-between mt-4'>
							<button
								onClick={handlePrevPage}
								disabled={currentPage === 1}
								className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
							>
								Предыдущая
							</button>
							<span className='text-gray-300'>
								Страница {currentPage} из {totalPages}
							</span>
							<button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
							>
								Следующая
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
