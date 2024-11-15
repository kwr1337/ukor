'use client'

import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import axios from "axios";

type Counterparty = {
	id: string
	type: string
	name: string
	warehouse_number:string
	INN: string
	email: { id: number; value: string; type: string }[]
	phone: { id: number; value: string; type: string }[]
}

export function CounterPartiesView() {
	const [data, setData] = useState<Counterparty[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [editCounterparty, setEditCounterparty] = useState<Counterparty | null>(
		null
	)
	const [selectedCounterparties, setSelectedCounterparties] = useState<
		string[]
	>([])
	const [searchValue, setSearchValue] = useState('')
	const [statusFilter, setStatusFilter] = useState<string | null>(null)
	const router = useRouter()


	useEffect(() => {
		fetch('/new_age/API/contragents/get_contragents.php')
			.then(response => response.json())
			.then(data => {
				const transformedData: Counterparty[] = data.map((item: any) => ({
					id: item.contragent_id,
					type: item.contragent_type,
					name: item.contragent_name,
					warehouse_number: item.contragent_warehouse_number,
					INN: item.contragent_inn,
					email: item.emails.map((email: any, index: number) => ({
						id: email.id || 0,
						value: email.value,
						type: email.type
					})),
					phone: item.phones.map((phone: any, index: number) => ({
						id: phone.id || 0,
						value: phone.value,
						type: phone.type
					}))
				}))
				setData(transformedData)
				console.log(transformedData)
			})
			.catch(error => console.error('Ошибка при загрузке контрагентов:', error))
	}, [])

	const handleEditCounterparty = (contragent: Counterparty) => {
		setEditCounterparty(contragent)
		setIsOpen(true)
	}

	const handleDeleteCounterparty = (id: any) => {
		// Отправка запроса на удаление контрагента на сервер
		fetch('/new_age/API/contragents/delete_contragent.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contragent_id: id, // передаем ID контрагента для удаления
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Ошибка HTTP: ${response.status}`);
				}
				return response.json(); // Получаем JSON из ответа
			})
			.then((jsonResult) => {
				// Проверяем успешность операции
				if (jsonResult.result === true) {
					// Удаляем контрагента из состояния
					setData((prevData) =>
						prevData.filter((contragent) => contragent.id !== id)
					);
				} else {
					console.error('Ошибка при удалении контрагента:', jsonResult.message || 'Неизвестная ошибка');
				}
			})
			.catch((error) => {
				console.error('Ошибка при удалении контрагента:', error.message);
				console.error('Полная ошибка:', error);
			});
	};


	const handleCheckboxChange = (id: string) => {
		setSelectedCounterparties(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(item => item !== id)
				: [...prevSelected, id]
		)
	}

	const handleSaveEdit = () => {
		if (editCounterparty) {
			const updatedPhones = editCounterparty.phone.map((phone) => ({
				...phone,
				id: phone.id || 0
			}));

			const updatedEmails = editCounterparty.email.map((email) => ({
				...email,
				id: email.id || 0
			}));

			// Отправка данных на сервер
			fetch('/new_age/API/contragents/update_contragent.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contragent_id: editCounterparty.id,
					contragent_name: editCounterparty.name,
					contragent_warehouse_number: editCounterparty.warehouse_number,
					contragent_type: editCounterparty.type,
					contragent_inn: editCounterparty.INN,
					contragent_phones: updatedPhones,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Ошибка HTTP: ${response.status}`);
					}
					return response.json(); // Получаем JSON из ответа
				})
				.then((jsonResult) => {
					// Проверяем поле result
					if (jsonResult.result === true) {
						setData((prevData) =>
							prevData.map((contragent) =>
								contragent.id === editCounterparty.id
									? {
										...contragent,
										name: editCounterparty.name,
										contragent_warehouse_number: editCounterparty.warehouse_number,
										type: editCounterparty.type,
										INN: editCounterparty.INN,
										phone: updatedPhones,
									}
									: contragent
							)
						);
						setIsOpen(false); // Закрытие модального окна
					} else {
						console.error('Ошибка при обновлении контрагента:', jsonResult.message || 'Неизвестная ошибка');
					}
				})
				.catch((error) => {
					console.error('Ошибка при обновлении контрагента:', error.message);
					// Дополнительно выводим информацию о запросе и ответе
					console.error('Полная ошибка:', error);
				});


		}
	};


	const mf = {
		marginLeft: '20%'
	}
	const f = {
		display: 'flex'
	}

	const filteredOrders = data.filter(
		order =>
			order.name.includes(searchValue) &&
			(!statusFilter || order.type === statusFilter)
	)

	const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		if (editCounterparty) {
			const updatedPhones = [...editCounterparty.phone];
			updatedPhones[index] = { ...updatedPhones[index], value: e.target.value }; // сохраняем id, обновляем value
			setEditCounterparty({ ...editCounterparty, phone: updatedPhones });
		}
	};

	const handleChangePhoneType = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
		if (editCounterparty) {
			const updatedPhones = [...editCounterparty.phone];
			updatedPhones[index] = { ...updatedPhones[index], type: e.target.value }; // сохраняем id, обновляем type
			setEditCounterparty({ ...editCounterparty, phone: updatedPhones });
		}
	};

	const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		if (editCounterparty) {
			const updatedEmails = [...editCounterparty.email];
			updatedEmails[index] = { ...updatedEmails[index], value: e.target.value }; // сохраняем id, обновляем value
			setEditCounterparty({ ...editCounterparty, email: updatedEmails });
		}
	};

	const handleChangeEmailType = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
		if (editCounterparty) {
			const updatedEmails = [...editCounterparty.email];
			updatedEmails[index] = { ...updatedEmails[index], type: e.target.value }; // сохраняем id, обновляем type
			setEditCounterparty({ ...editCounterparty, email: updatedEmails });
		}
	};

	const handleAddPhone = () => {
		if (editCounterparty && editCounterparty.phone.length < 2) {
			setEditCounterparty({
				...editCounterparty,
				phone: [
					...editCounterparty.phone,
					{ id: 0, value: '', type: 'work' } // добавляем новый телефон
				]
			});
		}
	};

	const handleRemovePhone = (index: number) => {
		if (editCounterparty) {
			const updatedPhones = editCounterparty.phone.filter((_, i) => i !== index);
			setEditCounterparty({ ...editCounterparty, phone: updatedPhones });
		}
	};

	const handleAddEmail = () => {
		if (editCounterparty && editCounterparty.email.length < 2) {
			setEditCounterparty({
				...editCounterparty,
				email: [
					...editCounterparty.email,
					{ id: 0, value: '', type: 'work' } // добавляем новый email
				]
			});
		}
	};

	const handleRemoveEmail = (index: number) => {
		if (editCounterparty) {
			const updatedEmails = editCounterparty.email.filter((_, i) => i !== index);
			setEditCounterparty({ ...editCounterparty, email: updatedEmails });
		}
	};

	const handleCreate = () => {
		router.push(DASHBOARD_PAGES.COUNTERPARTYVIEW)
	}

	// @ts-ignore
	return (
		<div>
			<div style={f}>
				<h1 className='text-3xl font-medium'>Контрагенты</h1>
				<div
					className='flex mb-4 space-x-2'
					style={mf}
				>
					<Button
						onClick={() => setStatusFilter(null)}
						className='bg-primary text-white px-4 py-2 rounded'
					>
						Все
					</Button>
					<Button
						onClick={() => setStatusFilter('Склад')}
						className='bg-primary text-white px-4 py-2 rounded'
					>
						Склад
					</Button>
					<Button
						onClick={() => setStatusFilter('Клиент')}
						className='bg-primary text-white px-4 py-2 rounded'
					>
						Клиент
					</Button>
					<Button
						onClick={() => setStatusFilter('Поставщик')}
						className='bg-gray-200 px-4 py-2 rounded'
					>
						Поставщик
					</Button>
				</div>
			</div>
			<div className='my-3 h-0.5 bg-border w-full' />
			<div className='max-w-8xl w-full mx-auto space-y-8'>
				<div className='shadow-md rounded-lg overflow-hidden'>
					<div className='px-6 py-4'>
						<div className='flex items-center space-x-4'>
							<input
								type='text'
								value={searchValue}
								onChange={e => setSearchValue(e.target.value)}
								className='px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 flex-1 bg-gray-700 text-white'
								placeholder='Введите значение для поиска'
							/>
							<Button
								onClick={handleCreate}
								className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
							>
								Создать
							</Button>
						</div>
					</div>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead className='bg-gray-700'>
							<tr>
								<th className='px-4 py-2'>
									<input
										type='checkbox'
										onChange={e =>
											setSelectedCounterparties(
												e.target.checked ? data.map(d => d.id) : []
											)
										}
									/>
								</th>
								<th className='px-6 py-3 text-xs text-center'>Тип</th>
								<th className='px-6 py-3 text-xs text-center'>Наименование</th>
								<th className='px-6 py-3 text-xs text-center'>Номер склада</th>
								<th className='px-6 py-3 text-xs text-center'>ИНН</th>
								<th className='px-6 py-3 text-xs text-center'>Почта</th>
								<th className='px-6 py-3 text-xs text-center'>Телефон</th>
								<th className='px-6 py-3 text-xs text-center'></th>
							</tr>
						</thead>
						<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{filteredOrders.map(contragent => (
								<tr key={contragent.id}>
									<td className='px-4 py-4 text-center'>
										<input
											type='checkbox'
											checked={selectedCounterparties.includes(contragent.id)}
											onChange={() => handleCheckboxChange(contragent.id)}
										/>
									</td>
									<td className='px-6 py-4 text-xs text-center'>{contragent.type}</td>
									<td className='px-6 py-4 text-xs text-center'>{contragent.name}</td>
									<td className='px-6 py-4 text-xs text-center'>{contragent.warehouse_number}</td>
									<td className='px-6 py-4 text-xs text-center'>{contragent.INN}</td>
									<td className='px-6 py-4 text-xs text-center'>
										{contragent.email.map(e => e.value).join(', ')}
									</td>
									<td className='px-6 py-4 text-xs text-center'>
										{contragent.phone.map(p => p.value).join(', ')}
									</td>
									<td className='px-6 py-4 text-xs text-center space-x-2'>
										{selectedCounterparties.includes(contragent.id) && (
											<>
												<Button
													onClick={() => handleEditCounterparty(contragent)}
													className='px-4 py-2 text-white rounded-md hover:bg-yellow-600'
												>
													Редактировать
												</Button>
												<Button
													onClick={() =>
														handleDeleteCounterparty(contragent.id)
													}
													className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
												>
													Удалить
												</Button>
											</>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Модальное окно для редактирования контрагента */}
				<Transition show={isOpen}>
					<Dialog
						as="div"
						className="fixed inset-0 z-10 overflow-y-auto backdrop-blur"
						onClose={() => setIsOpen(false)}
					>
						<div className="flex items-center justify-center min-h-screen">
							<Dialog.Panel className="bg-gray-800 rounded-lg w-3/4 max-w-2xl mx-auto p-8">
								<Dialog.Title className="text-lg font-medium text-white">
									Редактировать контрагента
								</Dialog.Title>
								<div className="mt-4">
									<div>
										<label className="block text-sm font-medium text-gray-300">
											Наименование
										</label>
										<input
											type="text"
											value={editCounterparty?.name || ""}
											onChange={(e) =>
												setEditCounterparty((prevState) =>
													prevState
														? {
															...prevState,
															name: e.target.value,
														}
														: null
												)
											}
											className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-300">
											ИНН
										</label>
										<input
											type="text"
											value={editCounterparty?.INN || ""}
											onChange={(e) =>
												setEditCounterparty((prevState) =>
													prevState
														? {
															...prevState,
															INN: e.target.value,
														}
														: null
												)
											}
											className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
										/>
									</div>

									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-300">
											Тип контрагента
										</label>
										<select
											value={editCounterparty?.type || ""}
											onChange={(e) =>
												setEditCounterparty((prevState) =>
													prevState
														? {
															...prevState,
															type: e.target.value,
														}
														: null
												)
											}
											className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
										>
											<option value="">Выберите тип</option>
											<option value="Склад">Склад</option>
											<option value="Клиент">Клиент</option>
											<option value="Поставщик">Поставщик</option>
											<option value="Наша компания">Наша компания</option>
										</select>
									</div>


									{editCounterparty?.type === "Склад" && (
										<div className="mt-4">
											<label className="block text-sm font-medium text-gray-300">
												Номер склада
											</label>
											<input
												value={editCounterparty?.warehouse_number || ""}
												onChange={(e) =>
													setEditCounterparty((prevState) =>
														prevState
															? {
																...prevState,
																warehouse_number: e.target.value
															}
															: null
													)
												}
												className="mt-1 px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
											/>
										</div>
									)}

									{/* Редактирование телефонов */}
									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-300">
											Телефоны
										</label>
										{editCounterparty?.phone.map((phone, index) => (
											<div key={index} className="flex space-x-2 mb-2">
												<input
													type="text"
													value={phone.value}
													onChange={(e) => handleChangePhone(e, index)}
													className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
												/>
												<select
													value={phone.type}
													onChange={(e) => handleChangePhoneType(e, index)}
													className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md"
												>
													<option value="Основной">Основной</option>
													<option value="Дополнительный">Дополнительный</option>
												</select>
												<button
													onClick={() => handleRemovePhone(index)}
													className="bg-red-500 text-white px-2 py-1 rounded-md"
													disabled={editCounterparty.phone.length <= 1}
												>
													Удалить
												</button>
											</div>
										))}
										{editCounterparty?.phone?.length && editCounterparty.phone.length < 2 ? (
											<button
												onClick={handleAddPhone}
												className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
											>
												Добавить телефон
											</button>
										) : (
											editCounterparty?.phone?.length === 0 && (
												<button
													onClick={handleAddPhone}
													className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
												>
													Добавить телефон
												</button>
											)
										)}
									</div>

									<div className="mt-6 flex justify-end space-x-4">
										<Button
											onClick={() => setIsOpen(false)}
											className="px-4 py-2 bg-gray-500 text-white rounded-md"
										>
											Отмена
										</Button>
										<Button
											onClick={handleSaveEdit}
											className="px-4 py-2 bg-blue-500 text-white rounded-md"
										>
											Сохранить
										</Button>
									</div>
								</div>
							</Dialog.Panel>
						</div>
					</Dialog>
				</Transition>

			</div>
		</div>
	)
}
