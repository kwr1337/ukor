'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API calls
import { Button } from "@/components/ui/buttons/Button";
import { Dialog, Transition } from '@headlessui/react';

export function NomenclatureView() {
    const [data, setData] = useState<any[]>([]); // State for storing the fetched data
    const [searchValue, setSearchValue] = useState('');
    const [selectedCBrand, setSelectedCBrand] = useState('');
    const [isOpen, setIsOpen] = useState(false); // For modals
    const [editData, setEditData] = useState<any | null>(null); // For editing
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Selected rows

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/new_age/API/nomenclature/get_nomenclature.php');
                setData(response.data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching nomenclature data", error);
            }
        };
        fetchData();
    }, []);


    const uniqueClients = Array.from(new Set(data.map(item => item.nomenclature_brand)));



    const handleAdd = async () => {
        try {
            const url = '/new_age/API/nomenclature/sync_nomenclature.php';

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
            const url = '/new_age/API/nomenclature/sync_nomenclature.php';
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
        if (editData?.id) {
            handleEdit();
        } else {
            handleAdd();
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('/new_age/API/nomenclature/get_nomenclature.php');
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

    const handleDelete = async () => {
        if (selectedRows.size > 0) {

            const selectedItems = Array.from(selectedRows).map(index => filteredOrders[index].nomenclature_id);

            try {

                for (const id of selectedItems) {
                    const response = await axios.post('/new_age/API/nomenclature/delete_nomenclature.php', {
                        nomenclature_id: id, // Отправляем по одному ID
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
            }
        } else {
            console.log('Не выбраны элементы для удаления');
        }
    };

    const filteredOrders = data.filter(item =>
        // Преобразуем значение поиска в нижний регистр для поиска по всем полям
        Object.keys(item).some(key =>
            item[key]?.toString().toLowerCase().includes(searchValue.toLowerCase())
        ) &&
        (!selectedCBrand || item.nomenclature_brand === selectedCBrand)
    );

    return (
        <div>
            <div>
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-medium">Номенклатура</h1>
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
                                onChange={(e) => setSelectedCBrand(e.target.value)}
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

                    <div className="px-6 py-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 mt-4">
                                <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Производитель</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Номер номенклатуры </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Производитель Steels</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Наименование</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Ссылка 1</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Ссылка 2</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Единица измерения</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Дата регистрации</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {filteredOrders.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_brand}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_number}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_brand_steels}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_name}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_link1}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_link2}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_unit}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{item.nomenclature_add_date}</td>
                                        <td className="px-6 py-4 text-center text-xs whitespace-nowrap">
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
                        </div>
                    </div>
                </div>
            </div>

            <Transition show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto backdrop-blur" onClose={() => setIsOpen(false)}>
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
                                    placeholder="Производитель"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_number || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_number: e.target.value})}
                                    placeholder="Номер номенклатуры"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                    readOnly={!editData?.id}
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_brand_steels || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_brand_steels: e.target.value})}
                                    placeholder="Производитель Steels"
                                    className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editData?.nomenclature_name || ''}
                                    onChange={(e) => setEditData({...editData, nomenclature_name: e.target.value})}
                                    placeholder="Наименование"
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
                                {/* Add more fields as needed */}
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
        </div>
    );
}
