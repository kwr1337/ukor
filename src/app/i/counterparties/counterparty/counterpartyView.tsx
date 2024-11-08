'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import axios from "axios";

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
		{ value: 'Основной', label: 'Основной' },
		{ value: 'Рабочий', label: 'Рабочий' },
		{ value: 'Дополнительный', label: 'Дополнительный' } // Добавлен тип для дополнительного телефона
	]

	const emailTypes = [
		{ value: 'Основная', label: 'Основная' },
		{ value: 'Рабочая', label: 'Рабочая' },
		{ value: 'Дополнительная', label: 'Дополнительная' } // Добавлен тип для дополнительной почты
	]

	const counterpartyTypes = [
		{ value: 'Склад', label: 'Склад' },
		{ value: 'Поставщик', label: 'Поставщик' },
		{ value: 'Клиент', label: 'Клиент' },
	]

	const [formData, setFormData] = useState({
		name: '',
		type: '',
		inn: '',
		phones: [{ value: '', type: 'main' }], // основной телефон
		emails: [{ value: '', type: 'main' }]  // основная почта
	})

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

	// Функция для добавления дополнительного телефона
	const addPhoneField = () => {
		setFormData(prevData => ({
			...prevData,
			phones: [...prevData.phones, { value: '', type: 'work' }] // добавляем рабочий телефон
		}))
	}

	// Функция для добавления дополнительной почты
	const addEmailField = () => {
		setFormData(prevData => ({
			...prevData,
			emails: [...prevData.emails, { value: '', type: 'work' }] // добавляем рабочую почту
		}))
	}

	// Функция для удаления дополнительного телефона
	const removePhoneField = () => {
		setFormData(prevData => ({
			...prevData,
			phones: prevData.phones.slice(0, -1) // удаляем последний дополнительный телефон
		}))
	}

	// Функция для удаления дополнительной почты
	const removeEmailField = () => {
		setFormData(prevData => ({
			...prevData,
			emails: prevData.emails.slice(0, -1) // удаляем последнюю дополнительную почту
		}))
	}

	const handleSubmit = async (e:any) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://147.45.153.94/new_age/API/contragents/add_contragent.php', {
				contragent_name: formData.name,
				contragent_type: formData.type,
				contragent_inn: formData.inn,
				contragent_phones: formData.phones,
				contragent_emails: formData.emails
			})
			console.log('Response:', response.data)
			alert('Контрагент успешно добавлен')
		} catch (error) {
			console.error('Ошибка при добавлении контрагента:', error)
		}
	}

	return (
		<div>
			<form className='w-2/4' onSubmit={handleSubmit}>
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
								<option key={type.value} value={type.value} selected>
									{type.label}
								</option>
							))}
						</select>

						<Field id='name' label='Наименование:' placeholder='Введите наименование' onChange={e => handleInputChange('name', e.target.value)} />
						<Field id='inn' label='ИНН:' placeholder='Введите ИНН' onChange={e => handleInputChange('inn', e.target.value)} />

						<Button type='submit' className={"mt-2"}>Сохранить</Button>
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
									<option key={type.value} value={type.value}>
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
										<option key={type.value} value={type.value}>
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
									<option key={type.value} value={type.value}>
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
										<option key={type.value} value={type.value}>
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
