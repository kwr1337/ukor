'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API calls
import { Button } from "@/components/ui/buttons/Button";
import { Dialog, Transition } from '@headlessui/react';
import Tooltip from '@mui/material/Tooltip';
import { API_BASE_URL } from '@/config/api.config';

export function NomenclatureView() {
    const [data, setData] = useState<any[]>([]); // State for storing the fetched data
    const [searchValue, setSearchValue] = useState('');
    const [selectedCBrand, setSelectedCBrand] = useState('');
    const [isOpen, setIsOpen] = useState(false); // For modals
    const [editData, setEditData] = useState<any | null>(null); // For editing
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Selected rows
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState<number[]>([]);

    const itemsPerPage = 100;



    const filteredOrders = data.filter(item =>
        Object.keys(item).some(key =>
            item[key]?.toString().toLowerCase().includes(searchValue.toLowerCase())
        ) &&
        (!selectedCBrand || item.nomenclature_brand === selectedCBrand)
    );





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/new_age/API/nomenclature/get_nomenclature.php`);
                const allData = response.data;
                setData(allData);
                setTotalPages(Math.ceil(allData.length / itemsPerPage));
            } catch (error) {
                console.error("Error fetching nomenclature data", error);
            }
        };
        fetchData();
    }, [currentPage]);


    useEffect(() => {
        setTotalPages(Math.ceil(filteredOrders.length / itemsPerPage));
        if (currentPage > Math.ceil(filteredOrders.length / itemsPerPage)) {
            setCurrentPage(1); // Сбрасываем на первую страницу, если текущая выходит за пределы
        }
    }, [filteredOrders]);


    const uniqueClients = Array.from(new Set(data.map(item => item.nomenclature_brand).sort()));





    const handleAdd = async () => {
        try {
            const url = `${API_BASE_URL}/new_age/API/nomenclature/sync_nomenclature.php`;

            const nomenclatureData = {
                nomenclature_number: editData?.nomenclature_number || '',
                nomenclature_brand: editData?.nomenclature_brand || '',
                nomenclature_brand_steels: editData?.nomenclature_brand_steels || '',
                nomenclature_name: editData?.nomenclature_name || '',
                nomenclature_link1: editData?.nomenclature_link1 || '',
                nomenclature_link2: editData?.nomenclature_link2 || '',
                nomenclature_unit: editData?.nomenclature_unit || ''
            };

            const response = await axios.post(url, nomenclatureData);

            if (response.data.result) {
                setIsOpen(false);
                fetchData();
            } else {
                console.error('Error adding nomenclature: ', response.data ? response.data.message : 'Unknown error');
            }

        } catch (error) {
            console.error('Error adding nomenclature:', error);
        }
    };




    const handleEdit = async () => {
        try {
            const url = `${API_BASE_URL}/new_age/API/nomenclature/sync_nomenclature.php`;
            const nomenclatureData = {
                nomenclature_number: editData?.nomenclature_number || '',
                nomenclature_brand: editData?.nomenclature_brand || '',
                nomenclature_brand_steels: editData?.nomenclature_brand_steels || '',
                nomenclature_name: editData?.nomenclature_name || '',
                nomenclature_link1: editData?.nomenclature_link1 || '',
                nomenclature_link2: editData?.nomenclature_link2 || '',
                nomenclature_unit: editData?.nomenclature_unit || ''
            };

            const response = await axios.post(url, nomenclatureData);

            if (response.data.result) {
                setSelectedRows(new Set());
                setIsOpen(false);
                fetchData();
            } else {
                console.error('Error updating nomenclature:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating nomenclature:', error);
        }
    };


    const handleSave = async () => {
        const requiredFields = ['nomenclature_brand', 'nomenclature_number', 'nomenclature_name'];
        const missingFields = requiredFields.filter(field => !editData?.[field]?.trim());

        if (missingFields.length > 0) {
            alert('Заполните обязательные поля: Производитель, Номер номенклатуры, Наименование');
            return;
        }

        if (editData?.id) {
            handleEdit();
        } else {
            handleAdd();
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/new_age/API/nomenclature/get_nomenclature.php`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching nomenclature data", error);
        }
    };



    const handleCheckboxChange = (index: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(index)) {
            newSelectedRows.delete(index);
        } else {
            newSelectedRows.add(index);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedRows = e.target.checked
            ? new Set<number>(filteredOrders.map((_, index) => index))  // Указываем тип Set<number>
            : new Set<number>();
        setSelectedRows(newSelectedRows);
    };




    const handleAddOrEdit = (item: any = null) => {
        setEditData(item ? item : {
            nomenclature_number: '',
            nomenclature_brand: '',
            nomenclature_brand_steels: '',
            nomenclature_name: '',
            nomenclature_link1: '',
            nomenclature_link2: '',
            nomenclature_unit: ''
        });
        setIsOpen(true);
    };


    const confirmDelete = (items: number[]) => {
        setItemsToDelete(items);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmedDelete = async () => {
        try {
            for (const id of itemsToDelete) {
                const response = await axios.post(`${API_BASE_URL}/new_age/API/nomenclature/delete_nomenclature.php`, {
                    nomenclature_id: id,
                });

                if (response.data.result) {
                    console.log(`Номенклатура с ID ${id} успешно удалена`);
                } else {
                    console.error(`Ошибка удаления номенклатуры с ID ${id}: `, response.data.message);
                }
            }

            setSelectedRows(new Set());
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        } finally {
            setIsDeleteConfirmOpen(false);
            setItemsToDelete([]);
        }
    };


    const handleDelete = () => {
        if (selectedRows.size > 0) {
            const selectedItems = Array.from(selectedRows).map(index => paginatedOrders[index].nomenclature_id);
            confirmDelete(selectedItems);
        } else {
            console.log('Не выбраны элементы для удаления');
        }
    };


    const handleBrandChange = (brand: string) => {
        setSelectedCBrand(brand)
        setSearchValue('')
        setCurrentPage(1)
    }



    const handleSort = (column: string) => {
        if (sortColumn === column) {
            // Если столбец уже выбран, меняем направление
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Устанавливаем новый столбец с сортировкой по возрастанию
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!sortColumn) return 0; // Если сортировка не задана, возвращаем без изменений
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

		// Если сортируем по дате и времени
		if (sortColumn === 'nomenclature_add_date') {
			const dateA = new Date(
				`${a.nomenclature_add_date.split('.').reverse().join('-')}T${a.nomenclature_add_time}`
			).getTime();
			const dateB = new Date(
				`${b.nomenclature_add_date.split('.').reverse().join('-')}T${b.nomenclature_add_time}`
			).getTime();

			aValue = dateA;
			bValue = dateB;
		}


        if (aValue === bValue) return 0;

        const compareResult = aValue > bValue ? 1 : -1;
        return sortDirection === 'asc' ? compareResult : -compareResult;
    });

    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div>
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-medium">Номенклатура ({filteredOrders.length}) </h1>
                    {/*<div className="flex mb-4 space-x-2">*/}
                    {/*    <Button className="bg-primary text-white px-4 py-2 rounded">Cкачать пустой шаблон</Button>*/}
                    {/*    <Button className="bg-gray-200 px-4 py-2 rounded">Скачать шаблон по выбранным</Button>*/}
                    {/*</div>*/}
                </div>
                <div className="my-3 h-0.5 bg-border w-full" />
            </div>

            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white"
                                placeholder="Введите значение для поиска"
                            />
                            <select
                                value={selectedCBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 text-white"
                            >
                                <option value="">Все бренды</option>
                                {uniqueClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </select>
                            <Button
                                onClick={() => handleAddOrEdit()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Добавить
                            </Button>
                        </div>
                    </div>

                            <table className="min-w-full divide-y divide-gray-700 mt-4">
                                <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-center">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th
                                        onClick={() => handleSort('nomenclature_number')}
                                        className="px-6 py-3 text-xs text-center">
                                        <Tooltip title="Сортировка по номеру номенклатуры" arrow>
                                            <span>Номер номенклатуры {sortColumn === 'nomenclature_number' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th
                                        onClick={() => handleSort('nomenclature_brand')}
                                        className="px-6 py-3 text-xs text-center cursor-pointer">
                                        <Tooltip title="Сортировка по производителю" arrow>
                                            <span>Производитель {sortColumn === 'nomenclature_brand' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    {/*241118 По просьбе Марата закоментировал*/}
                                    {/*<th className="px-6 py-3 text-xs text-center"*/}
                                    {/*    onClick={() => handleSort('nomenclature_brand_steels')}>*/}
                                    {/*    <Tooltip title="Сортировка по производителю Steels" arrow>*/}
                                    {/*        <span>Производитель Steels {sortColumn === 'nomenclature_brand_steels' && (sortDirection === 'asc' ? '↑' : '↓')}</span>*/}
                                    {/*    </Tooltip>*/}
                                    {/*</th>*/}
                                    <th className="px-6 py-3 text-xs text-center"
                                        onClick={() => handleSort('nomenclature_name')}>
                                        <Tooltip title="Сортировка по наименованию" arrow>
                                            <span>Наименование {sortColumn === 'nomenclature_name' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-3 text-xs text-center"
                                        onClick={() => handleSort('nomenclature_link1')}>
                                        <Tooltip title="Сортировка по ссылке 1" arrow>
                                            <span>Ссылка 1 {sortColumn === 'nomenclature_link1' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-3 text-xs text-center"
                                        onClick={() => handleSort('nomenclature_link2')}>
                                        <Tooltip title="Сортировка по ссылке 2" arrow>
                                            <span>Ссылка 2 {sortColumn === 'nomenclature_link2' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-3 text-xs text-center"
                                        onClick={() => handleSort('nomenclature_unit')}>
                                        <Tooltip title="Сортировка по единице измерения" arrow>
                                            <span>Единица измерения {sortColumn === 'nomenclature_unit' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-3 text-xs text-center"
                                        onClick={() => handleSort('nomenclature_add_date')}>
                                        <Tooltip title="Сортировка по дате регистрации" arrow>
                                            <span>Дата и время регистрации {sortColumn === 'nomenclature_add_date' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-3 text-xs text-center"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {paginatedOrders.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-left text-xs ">{item.nomenclature_number}</td>
                                        <td className="px-6 py-4 text-center text-xs ">{item.nomenclature_brand}</td>
                                        {/*241118 По просьбе Марата закоментировал*/}
                                        {/*<td className="px-6 py-4 text-left text-xs ">{item.nomenclature_brand_steels}</td>*/}
                                        <td className="px-6 py-4 text-left text-xs ">{item.nomenclature_name}</td>
                                        <td className="px-6 py-4 text-center text-xs ">{item.nomenclature_link1}</td>
                                        <td className="px-6 py-4 text-center text-xs ">{item.nomenclature_link2}</td>
                                        <td className="px-6 py-4 text-center text-xs ">{item.nomenclature_unit}</td>
                                        <td className="px-6 py-4 text-center text-xs ">{item.nomenclature_add_date}, {item.nomenclature_add_time}</td>
                                        <td className="px-6 py-4 text-center text-xs ">
                                            {selectedRows.has(index) && (
                                                <div className={"flex flex-wrap justify-center items-center"}>

                                                    <Button
                                                        onClick={() => handleDelete()}
                                                        className="px-4 py-2 text-white rounded-md hover:bg-red-600 mb-1"
                                                    >
                                                        Удалить
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleAddOrEdit(item)}
                                                        className="px-4 py-2  text-white rounded-md hover:bg-yellow-500"
                                                    >
                                                        Редактировать
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>




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
            </div>

            <Transition show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto backdrop-blur"
                        onClose={() => setIsOpen(false)}>
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <Dialog.Panel className="bg-gray-800 rounded-lg w-3/4 max-w-2xl mx-auto p-8">
                            <Dialog.Title className="text-lg font-medium text-white">
                                {editData?.id ? 'Редактировать' : 'Добавить'} Номенклатуру
                            </Dialog.Title>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={editData?.nomenclature_brand || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_brand: e.target.value})}
                                    placeholder="Производитель (Обязательно)"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_number || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_number: e.target.value})}
                                    placeholder="Номер номенклатуры (Обязательно)"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                {/*<input*/}
                                {/*    type="text"*/}
                                {/*    value={editData?.nomenclature_brand_steels || ''}*/}
                                {/*    onChange={(e) => setEditData({...editData, nomenclature_brand_steels: e.target.value})}*/}
                                {/*    placeholder="Производитель Steels"*/}
                                {/*    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"*/}
                                {/*/>*/}
                                <input
                                    type="text"
                                    value={editData?.nomenclature_name || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_name: e.target.value})}
                                    placeholder="Наименование (Обязательно)"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_link1 || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_link1: e.target.value})}
                                    placeholder="Ссылка 1"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_link2 || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_link2: e.target.value})}
                                    placeholder="Ссылка 2"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_unit || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_unit: e.target.value})}
                                    placeholder="Единица измерения"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-4">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Сохранить
                                </Button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>


            <Transition show={isDeleteConfirmOpen} as={React.Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto backdrop-blur " onClose={setIsDeleteConfirmOpen}>
                    <div className="flex items-center justify-center min-h-screen p-4 ">
                        <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
                        <div className="bg-gray-800 rounded-lg w-3/4 max-w-md mx-auto p-6 border-white border">
                            <Dialog.Title as="h3" className="text-lg text-center leading-6 font-medium text-gray-500">
                                Подтвердите удаление
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-center text-gray-500">
                                    Вы уверены, что хотите удалить? Это действие необратимо.
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <Button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                                    Отмена
                                </Button>
                                <Button onClick={handleConfirmedDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    Удалить
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
}
