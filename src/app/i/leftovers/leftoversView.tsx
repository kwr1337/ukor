'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader/loader'
import { Button } from '@/components/ui/buttons/Button'

interface LeftOvers {
	nomenclature_id: string
	nomenclature_number: string
	product_id: string
	product_contragent_id: string
	product_article: string
	product_name: string
	product_price: string
	product_amount: string
	product_brand: string
	product_add_date: string
	product_add_time: string
	product_update_date: string
	product_update_time: string
}

interface Contragent {
	id: number
	name: string
}

export function LeftoversView() {
	const [leftOversItems, setLeftOversItems] = useState<LeftOvers[]>([])
	const [brands, setBrands] = useState<string[]>([])
	const [searchValue, setSearchValue] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('')
	const [selectedBrand, setSelectedBrand] = useState<string>('')
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 100

	const [sortColumn, setSortColumn] = useState<keyof LeftOvers | ''>('')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	const [contragents, setContragents] = useState<Contragent[]>([])
	const [warehouses, setWarehouses] = useState<string[]>([])

	const router = useRouter()

	const fetchLeftovers = async (contragentId?: number) => {
		setLoading(true)
		try {
			const url = contragentId
				? `/new_age/API/warehouses/get_warehouses.php?filter[contragent_id]=${contragentId}`
				: '/new_age/products.php'
			const response = await axios.get(url)

			const nomenclature = contragentId
				? response.data[0]?.nomenclature || []
				: response.data

			const flattenedNomenclature = nomenclature.flat()

			setLeftOversItems(flattenedNomenclature)
		} catch (error) {
			console.error('Ошибка при получении данных остатков:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await axios.get('/new_age/API/nomenclature/get_nomenclature.php')
				const brandData: string[] = response.data.map(
					(item: { nomenclature_brand: string }) => item.nomenclature_brand
				)
				setBrands(Array.from(new Set(brandData)).sort())
			} catch (error) {
				console.error('Ошибка при получении данных брендов:', error)
			}
		}

		const fetchContragents = async () => {
			try {
				const response = await axios.get('/new_age/API/contragents/get_contragents.php')
				const contragentsData = response.data.filter(
					(contragent: { contragent_type: string }) => contragent.contragent_type === 'Склад'
				)
				setContragents(
					contragentsData.map((contragent: any) => ({
						id: contragent.contragent_id,
						name: contragent.contragent_name,
					}))
				)
			} catch (error) {
				console.error('Ошибка при получении данных контрагенентов:', error)
			}
		}

		fetchLeftovers()
		fetchBrands()
		fetchContragents()
	}, [])

	const handleContragentChange = (contragentId: number) => {
		setStatusFilter('')
		setWarehouses([])
		fetchLeftovers(contragentId)
		setCurrentPage(1)
	}

	const filterItems = (items: LeftOvers[]) =>
		!statusFilter ? items : items.filter(item => item.product_article === statusFilter)

	const filterByBrand = (items: LeftOvers[]) => {
		if (!selectedBrand) return items
		return items.filter(item => item.product_brand === selectedBrand)
	}

	const searchItems = (items: LeftOvers[]) => {
		if (!searchValue) return items
		return items.filter(
			item =>
				item.product_name.toLowerCase().includes(searchValue.toLowerCase()) ||
				item.product_article.toLowerCase().includes(searchValue.toLowerCase()) ||
				item.product_brand.toLowerCase().includes(searchValue.toLowerCase())
		)
	}

	const filteredItems = filterItems(leftOversItems)
	const brandFilteredItems = filterByBrand(filteredItems)
	const searchedItems = searchItems(brandFilteredItems)

	const totalItems = searchedItems.length
	const totalPages = Math.ceil(totalItems / itemsPerPage)
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const sortItems = (items: LeftOvers[]) => {
		if (!sortColumn) return items
		return [...items].sort((a, b) => {
			let valueA: any = a[sortColumn]
			let valueB: any = b[sortColumn]
			if (
				sortColumn === 'product_update_date' ||
				sortColumn === 'product_update_time'
			) {
				const dateA = new Date(`${a.product_update_date} ${a.product_update_time}`)
				const dateB = new Date(`${b.product_update_date} ${b.product_update_time}`)
				valueA = dateA.getTime()
				valueB = dateB.getTime()
			}
			return valueA < valueB
				? sortOrder === 'asc'
					? -1
					: 1
				: valueA > valueB
					? sortOrder === 'asc'
						? 1
						: -1
					: 0
		})
	}

	const sortedItems = sortItems(searchedItems)
	const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem)

	const handleSort = (column: keyof LeftOvers) => {
		if (sortColumn === column) {
			setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortColumn(column)
			setSortOrder('asc')
		}
	}

	const handleBrandChange = (brand: string) => {
		setSelectedBrand(brand)
		setSearchValue('')
		setStatusFilter('')
		setCurrentPage(1)
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	return (
		<div>
			<div>
				<div className='flex'>
					<h1 className='text-3xl font-medium'>Остатки товаров ({totalItems})</h1>
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
						onChange={e => handleContragentChange(Number(e.target.value))}
						className='px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
					>
						<option value=''>Выберите контрагента</option>
						{contragents.map(contragent => (
							<option key={contragent.id} value={contragent.id}>
								{contragent.name}
							</option>
						))}
					</select>
					<select
						value={selectedBrand}
						onChange={e => handleBrandChange(e.target.value)}
						className='px-4 py-2.5 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white'
					>
						<option value=''>Выберите бренд</option>
						{brands.map((brand, index) => (
							<option key={index} value={brand}>
								{brand}
							</option>
						))}
					</select>

					<Button
						onClick={event => window.open('http://147.45.153.94/new_age/parse_post_files/show_parsing.php', '_blank')}
					>
						Лог
					</Button>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : (
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
					<tr>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_name')}
						>
							Наименование товара
							{sortColumn === 'product_name' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_article')}
						>
							Артикул
							{sortColumn === 'product_article' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_brand')}
						>
							Бренд
							{sortColumn === 'product_brand' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_amount')}
						>
							Количество
							{sortColumn === 'product_amount' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_price')}
						>
							Цена
							{sortColumn === 'product_price' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_update_date')}
						>
							Дата и время добавления
							{sortColumn === 'product_update_date' && (
								<span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
							)}
						</th>
					</tr>
					</thead>
					<tbody className={'bg-gray-800 divide-y divide-gray-700'}>
					{currentItems.map(item => (
						<tr key={item.nomenclature_id}>
							<td className='px-6 py-4 text-xs text-center'>{item.product_name}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_article}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_brand}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_amount}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_price}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_update_date}, {item.product_update_time}</td>
						</tr>
					))}
					</tbody>
				</table>
			)}

			<div className="flex justify-between items-center mt-4">
				<button
					onClick={handlePrevPage}
					disabled={currentPage === 1}
					className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
				>
					Предыдущая
				</button>
				<span className="text-sm text-gray-300">
          Страница {currentPage} из {totalPages}
        </span>
				<button
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
					className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
				>
					Следующая
				</button>
			</div>
		</div>
	)
}
