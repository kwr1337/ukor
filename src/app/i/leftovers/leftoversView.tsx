'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import Loader from '@/components/ui/Loader/loader'
import { Button } from '@/components/ui/buttons/Button'
import { FaFileExcel } from 'react-icons/fa'; // импорт пиктограммы Excel
import * as XLSX from 'xlsx'; // импорт библиотеки для работы с Excel
import { API_BASE_URL } from '@/config/api.config'

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
	warehouse_number?: string;
}

interface Contragent {
	id: string
	name: string
	warehouseNumber: string;
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

	//Выгрузка сладов с бека
	const fetchLeftovers = async (contragentId?: number) => {
		setLoading(true);
		try {
			const url = contragentId
				? `/api/warehouses/get_warehouses.php?filter[contragent_id]=${contragentId}`
				: `/api/warehouses/get_warehouses.php`;

			const response = await axios.get(url);

			const nomenclature = contragentId
				? response.data[0]?.nomenclature || []
				: response.data.flatMap((warehouse: any) => warehouse.nomenclature || []);

			const enrichedNomenclature = nomenclature.map((item: any) => ({
				...item,
				warehouse_number: getWarehouseNumber(item.product_contragent_id), // Добавить номер склада
			}));

			setLeftOversItems(enrichedNomenclature);
		} catch (error) {
			console.error('Ошибка при получении данных остатков:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await axios.get(`/api/nomenclature/get_nomenclature.php`)
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
				const response = await axios.get(`/api/contragents/get_contragents.php`);
				const contragentsData = response.data.filter(
					(contragent: { contragent_type: string; contragent_deleted: string }) =>
						contragent.contragent_type === 'Склад' && contragent.contragent_deleted === '0'
				);
				setContragents(
					contragentsData.map((contragent: any) => ({
						id: contragent.contragent_id,
						name: contragent.contragent_name,
						warehouseNumber: contragent.contragent_warehouse_number, // Предположим, что это поле есть
					}))
				);
			} catch (error) {
				console.error('Ошибка при получении данных контрагентов:', error);
			}
		};

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

	const getWarehouseNumber = (contragentId: string) => {
		const contragent = contragents.find(c => c.id === contragentId);
		return contragent ? contragent.warehouseNumber : 'Неизвестно';
	};



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
		if (!sortColumn) return items;

		return [...items].sort((a, b) => {
			let valueA: any = a[sortColumn];
			let valueB: any = b[sortColumn];

			// Сортировка по номеру склада
			if (sortColumn === 'warehouse_number') {
				const warehouseA = getWarehouseNumber(a.product_contragent_id) || '';
				const warehouseB = getWarehouseNumber(b.product_contragent_id) || '';
				return sortOrder === 'asc'
					? warehouseA.localeCompare(warehouseB)
					: warehouseB.localeCompare(warehouseA);
			}

			// Сортировка по дате и времени обновления
			if (sortColumn === 'product_update_date') {
				const dateA = new Date(`${a.product_update_date.split('.').reverse().join('-')}T${a.product_update_time}`);
				const dateB = new Date(`${b.product_update_date.split('.').reverse().join('-')}T${b.product_update_time}`);
				return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
			}

			// Если значения числовые, сортируем как числа
			if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
				return sortOrder === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
			}

			// Если значения строки, сортируем как строки
			if (typeof valueA === 'string' && typeof valueB === 'string') {
				return sortOrder === 'asc'
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}

			// Дополнительный критерий сортировки для одинаковых значений
			if (valueA === valueB) {
				return a.nomenclature_id.localeCompare(b.nomenclature_id); // Добавление ID для уникальности
			}


			// Обработка на случай некорректных данных
			return 0;
		});
	};




	const sortedItems = sortItems(searchedItems);
	const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

	const handleSort = (column: keyof LeftOvers | 'warehouse_number') => {
		// Если сортируем по тому же столбцу, меняем порядок сортировки
		if (sortColumn === column) {
			setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
		} else {
			// Если сортируем по другому столбцу, устанавливаем его как активный и по умолчанию сортируем по возрастанию
			setSortColumn(column);
			setSortOrder('asc');
		}
	};


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

	const handleDownloadExcel = () => {

		const dataToExport = sortedItems.map(item => ({
			'Наименование товара': item.product_name,
			'Артикул': item.product_article,
			'Бренд': item.product_brand,
			'Количество': item.product_amount,	
			'Цена': Number(item.product_price),
			'Склад': getWarehouseNumber(item.product_contragent_id),
			'Дата и время обновления': `${item.product_update_date} ${item.product_update_time}`,
		}));

		// Создание и скачивание Excel файла
		const ws = XLSX.utils.json_to_sheet(dataToExport);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Остатки товаров');

		const now = new Date();

		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = now.getFullYear(); // Год
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');

		const formattedDateTime = `${year}${month}${day}_${hours}${minutes}`;
		// Скачивание файла
		XLSX.writeFile(wb, `Выгрузка_остатков_${formattedDateTime}.xlsx`);
	};

	const handleLog = () => {
		window.open(`http://147.45.153.94/new_age/parse_post_files/show_parsing.php`, '_blank')
	};




	return (
		<div className="flex flex-col flex-1 w-full">
			<div>
				<div className='flex'>
					<h1 className='text-3xl font-medium'>Cклады ({totalItems})</h1>
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
						<option value=''>Выберите склад</option>
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


					<Tooltip title="Показать логирование парсинга почты" arrow>
						<Button onClick={handleLog}>
							Лог
						</Button>
					</Tooltip>

					<Tooltip title="Выгрузить в Excel" arrow>
						<Button onClick={handleDownloadExcel}>
							<FaFileExcel className="text-[27px]" />
						</Button>
					</Tooltip>

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
							onClick={() => handleSort('product_name')}>
							<Tooltip title="Сортировка по наименование товара" arrow>
								<span>Наименование товара {sortColumn === 'product_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}</span>
							</Tooltip>
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_article')}>
							<Tooltip title="Сортировка по артиклу" arrow>
								<span>Артикул {sortColumn === 'product_article' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}</span>
							</Tooltip>
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_brand')}>
							<Tooltip title="Сортировка по бренду" arrow>
								<span>Бренд {sortColumn === 'product_brand' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}</span>
							</Tooltip>
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_amount')}>
							<Tooltip title="Сортировка по количеству" arrow>
								<span>Количество {sortColumn === 'product_amount' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}</span>
							</Tooltip>
						</th>
						<th
							className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_price')}>
							<Tooltip title="Сортировка по цене" arrow>
								<span>Цена {sortColumn === 'product_price' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}</span>
							</Tooltip>
						</th>
						<th className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('warehouse_number')}>
							<Tooltip title="Сортировка по номеру склада" arrow>
								<span>Номер склада {sortColumn === 'warehouse_number' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
							</Tooltip>
						</th>
						<th className='px-6 py-3 text-xs text-center cursor-pointer'
							onClick={() => handleSort('product_update_date')}>
							<Tooltip title="Сортировка по дате и времени" arrow>
								<span>Дата и время обновления {sortColumn === 'product_update_date' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
							</Tooltip>
						</th>
					</tr>
					</thead>
					<tbody className={'bg-gray-800 divide-y divide-gray-700'}>
					{currentItems.map(item => (
						<tr key={`${item.nomenclature_id}-${item.product_article}-${item.product_contragent_id}`}>
							<td className='px-6 py-4 text-xs text-left'>{item.product_name}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_article}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_brand}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_amount}</td>
							<td className='px-6 py-4 text-xs text-center'>{item.product_price}</td>
							<td className='px-6 py-4 text-xs text-center'>{getWarehouseNumber(item.product_contragent_id)}</td>
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
