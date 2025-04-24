'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import axios from "axios";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/config/api.config'

type Phone = {
	value: string;
	type: string;
};

type Email = {
	value: string;
	type: string;
};

type FormData = {
	name: string;
	type: string;
	inn: string;
	phones: Phone[];
	emails: Email[];
};

export function CounterpartyView() {
	const phoneTypes = [
		{ value: 'main', label: 'Основной' },
		{ value: 'additional', label: 'Дополнительный' }
	];

	const emailTypes = [
		{ value: 'main', label: 'Основная' },
		{ value: 'parsing', label: 'На парсинг' }
	];

	const counterpartyTypes = [
		{ value: 'склад', label: 'Склад' },
		{ value: 'Поставщик', label: 'Поставщик' },
		{ value: 'Клиент', label: 'Клиент' },
		{ value: 'Наша компания', label: 'Наша компания' },
	];

	const [formData, setFormData] = useState<FormData>({
		name: '',
		type: counterpartyTypes[0].value,
		inn: '',
		phones: [{ value: '', type: phoneTypes[0].value }],
		emails: [{ value: '', type: emailTypes[0].value }]
	});

	const [existingCounterparties, setExistingCounterparties] = useState<FormData[]>([]);
	const [errors, setErrors] = useState<string | null>(null);
	const router = useRouter();

	// Новое состояние для дополнительного поля для типа "Склад"
	const [warehouseAddress, setWarehouseAddress] = useState<string>("");

	const handleBack = () => {
		router.push(DASHBOARD_PAGES.COUNTERPARTIES);
	}

	useEffect(() => {
		const fetchCounterparties = async () => {
			try {
				const response = await axios.get(`/api/contragents/get_contragents.php`);
				setExistingCounterparties(response.data);
			} catch (error) {
				console.error('Ошибка при получении контрагентов:', error);
			}
		};
		fetchCounterparties();
	}, []);

	const isUniqueAndComplete = (): boolean => {
		const { name, inn, type, phones, emails } = formData;

		// Проверка обязательных полей
		if (!name || !type || !phones[0].value || !emails[0].value) {
			setErrors('Все обязательные поля должны быть заполнены.');
			return false;
		}

		// Если выбран тип "Склад", проверяем, что адрес склада заполнен
		if (type === 'склад' && !warehouseAddress) {
			setErrors('Для типа "Склад" необходимо заполнить название склада.');
			return false;
		}

		// Проверки уникальности
		// @ts-ignore
		const nameExists = existingCounterparties.some(counterparty => counterparty.counterparty_name === name);
		// const innExists = existingCounterparties.some(counterparty => counterparty.inn === inn);

		if (nameExists) {
			setErrors('Контрагент с таким именем уже существует');
			return false;
		}
		// if (innExists) {
		// 	setErrors('Контрагент с таким ИНН уже существует');
		// 	return false;
		// }
		for (let phone of phones) {
			const phoneExists = existingCounterparties.some(counterparty =>
				counterparty.phones.some(p => p.value === phone.value)
			);
			if (phoneExists) {
				setErrors('Контрагент с таким номером телефона уже существует');
				return false;
			}
		}
		for (let email of emails) {
			const emailExists = existingCounterparties.some(counterparty =>
				counterparty.emails.some(e => e.value === email.value)
			);
			if (emailExists) {
				setErrors('Контрагент с таким email уже существует');
				return false;
			}
		}

		setErrors(null);
		return true;
	};

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData(prevData => ({ ...prevData, [field]: value }));
	};

	const handlePhoneChange = (index: number, field: keyof Phone, value: string) => {
		const updatedPhones = [...formData.phones];
		updatedPhones[index][field] = value;
		setFormData(prevData => ({ ...prevData, phones: updatedPhones }));
	};

	const handleEmailChange = (index: number, field: keyof Email, value: string) => {
		const updatedEmails = [...formData.emails];
		updatedEmails[index][field] = value;
		setFormData(prevData => ({ ...prevData, emails: updatedEmails }));
	};

	const addPhoneField = () => {
		setFormData(prevData => ({
			...prevData,
			phones: [...prevData.phones, { value: '', type: phoneTypes[1].value }]
		}))
	}

	const addEmailField = () => {
		setFormData(prevData => ({
			...prevData,
			emails: [...prevData.emails, { value: '', type: emailTypes[1].value }]
		}))
	}

	const removePhoneField = () => {
		setFormData(prevData => ({
			...prevData,
			phones: prevData.phones.slice(0, -1)
		}))
	}

	const removeEmailField = () => {
		setFormData(prevData => ({
			...prevData,
			emails: prevData.emails.slice(0, -1)
		}))
	}






	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!isUniqueAndComplete()) return;

		try {
			// Модификация email данных для добавления поля 'parsing'
			const updatedEmails = formData.emails.map(email => ({
				...email,
				parsing: email.type === 'На парсинг' ? true : false, // Если тип "На парсинг", то устанавливаем parsing в true
			}));

			// Преобразуем warehouseAddress только если тип контрагента 'Склад'
			const contragentWarehouseNumber = formData.type === 'склад' && warehouseAddress ? warehouseAddress : null;

			// Создаем объект с данными для отправки на сервер
			const requestData = {
				contragent_name: formData.name,
				contragent_type: formData.type,
				contragent_warehouse_number: contragentWarehouseNumber ? Number(contragentWarehouseNumber) : null,
				contragent_inn: formData.inn,
				contragent_phones: formData.phones.map(phone => ({
					value: phone.value,
					type: phone.type,
				})),
				contragent_emails: updatedEmails,
			};

			const response = await axios.post(`/api/contragents/add_contragent.php`, requestData);

			console.log('Успех:', response.data);
			alert('Контрагент успешно добавлен');
			handleBack();

		} catch (error) {
			console.error('Ошибка при добавлении контрагента:', error);
		}
	};




	return (
		<div>
			<form className='w-2/4' onSubmit={handleSubmit}>

				{errors && <div className="text-red-500">{errors}</div>}

				<div className='grid grid-cols-3 gap-10'>
					<div>
						<label htmlFor='counterpartyType' className='text-sm text-white/60 dark:text-white ml-1.5 font-medium'>
							Тип контрагента:
						</label>
						<select
							id='counterpartyType'
							value={formData.type}
							onChange={e => handleInputChange('type', e.target.value)}
							className='mt-2 bg-bg flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base outline-none placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors focus:border-primary'
						>
							{counterpartyTypes.map(type => (
								<option className={"bg-bg"} key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>

						{formData.type === 'склад' && (
							<Field
								id="warehouseAddress"
								label="Название склада"
								placeholder="Введите название склада"
								value={warehouseAddress}
								onChange={e => setWarehouseAddress(e.target.value)}
							/>
						)}

						<Field id='name' label='Наименование:' placeholder='Введите наименование' onChange={e => handleInputChange('name', e.target.value)} />
						<Field id='inn' label='ИНН:' placeholder='Введите ИНН' onChange={e => handleInputChange('inn', e.target.value)} />

						<Button type='submit' className={"mt-2 hover:bg-green-500 w-full"}>Сохранить</Button>
						<Button className={"mt-2 hover:bg-red-500 w-full"} onClick={handleBack}>Отмена</Button>
					</div>

					<div>
						{/* Основной телефон */}
						<div>
							<label htmlFor={`phone-0`} className="text-sm text-white/60 dark:text-white ml-1.5 font-medium">
								Тип телефона:
							</label>
							<select
								id={`phone-0`}
								value={formData.phones[0].type}
								onChange={e => handlePhoneChange(0, 'type', e.target.value)}
								className="mt-2 bg-bg flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base outline-none placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors focus:border-primary"
							>
								{phoneTypes.map(type => (
									<option className={"bg-bg"} key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>

							<Field
								id={`phone-0`}
								label="Телефон"
								placeholder="Введите телефон"
								value={formData.phones[0].value}
								onChange={e => handlePhoneChange(0, 'value', e.target.value)}
							/>
						</div>

						{/* Дополнительный телефон */}
						{formData.phones.length > 1 && (
							<div>
								<label htmlFor={`phone-1`} className="text-sm text-white/60 dark:text-white ml-1.5 font-medium">
									Тип телефона:
								</label>
								<select
									id={`phone-1`}
									value={formData.phones[1].type}
									onChange={e => handlePhoneChange(1, 'type', e.target.value)}
									className="mt-2 bg-bg flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base outline-none placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors focus:border-primary"
								>
									{phoneTypes.map(type => (
										<option className={"bg-bg"} key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>

								<Field
									id="additionalPhone"
									label="Доп. телефон"
									placeholder="Введите доп телефон"
									value={formData.phones[1].value}
									onChange={e => handlePhoneChange(1, 'value', e.target.value)}
								/>
							</div>
						)}

						<Button
							type='button'
							className="w-full mt-2"
							onClick={formData.phones.length === 1 ? addPhoneField : removePhoneField}
						>
							{formData.phones.length === 1 ? 'Добавить доп телефон' : 'Убрать телефон'}
						</Button>
					</div>

					<div>
						{/* Основная почта */}
						<div>
							<label htmlFor={`email-0`} className="text-sm text-white/60 dark:text-white ml-1.5 font-medium">
								Тип почты:
							</label>
							<select
								id={`email-0`}
								value={formData.emails[0].type}
								onChange={e => handleEmailChange(0, 'type', e.target.value)}
								className="mt-2 bg-bg flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base outline-none placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors focus:border-primary"
							>
								{emailTypes.map(type => (
									<option className={"bg-bg"} key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>

							<Field
								id={`email-0`}
								label="Почта"
								placeholder="Введите почту"
								value={formData.emails[0].value}
								onChange={e => handleEmailChange(0, 'value', e.target.value)}
							/>
						</div>

						{/* Дополнительная почта */}
						{formData.emails.length > 1 && (
							<div>
								<label htmlFor={`email-1`} className="text-sm text-white/60 dark:text-white ml-1.5 font-medium">
									Тип почты:
								</label>
								<select
									id={`email-1`}
									value={formData.emails[1].type}
									onChange={e => handleEmailChange(1, 'type', e.target.value)}
									className="mt-2 bg-bg flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base outline-none placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors focus:border-primary"
								>
									{emailTypes.map(type => (
										<option className={"bg-bg"} key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>

								<Field
									id="additionalEmail"
									label="Доп. почта"
									placeholder="Введите доп почту"
									value={formData.emails[1].value}
									onChange={e => handleEmailChange(1, 'value', e.target.value)}
								/>
							</div>
						)}

						<Button
							type='button'
							className="w-full mt-2"
							onClick={formData.emails.length === 1 ? addEmailField : removeEmailField}
						>
							{formData.emails.length === 1 ? 'Добавить доп почту' : 'Убрать почту'}
						</Button>
					</div>
				</div>


			</form>
		</div>
	)
}
