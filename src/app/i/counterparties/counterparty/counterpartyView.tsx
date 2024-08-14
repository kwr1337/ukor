'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

export function CounterpartyView() {

    const phoneTypes = [
        { value: 'main', label: 'Основной' },
        { value: 'work', label: 'Рабочий' },
        // Add more options as needed
    ];

    const emailTypes = [
        { value: 'main', label: 'Основная' },
        { value: 'work', label: 'Рабочая' },
        // Add more options as needed
    ];

    const counterpartyTypes = [
        { value: 'warehouse', label: 'Склад' },
        { value: 'supplier', label: 'Поставщик' },
        // Add more options as needed
    ];

    return (
        <div>
            <form className='w-2/4'>
                <div className='grid grid-cols-3 gap-10'>
                    <div>
                        <label htmlFor='counterpartyType' className='block mb-2'>
                            Тип контрагента:
                        </label>
                        <select id='counterpartyType' className='block w-full mb-4 p-2 border border-gray-300 rounded'>
                            {counterpartyTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        <Field
                            id='name'
                            label='Наименование: '
                            placeholder='Введите наименование: '
                            extra='mb-4'
                        />

                        <Field
                            id='inn'
                            label='ИНН: '
                            placeholder='Введите ИНН: '
                            extra='mb-10'
                        />
                    </div>

                    <div>
                        <Field
                            id='phone'
                            label='Телефон:'
                            placeholder='Введите телефон: '
                            isNumber
                            extra='mb-4'
                        />

                        <label htmlFor='phoneType' className='block mb-2'>
                            Тип телефона:
                        </label>
                        <select id='phoneType' className='block w-full mb-4 p-2 border border-gray-300 rounded'>
                            {phoneTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        <Button
                            type='button'

                        >
                            Добавить почту
                        </Button>
                    </div>

                    <div>
                        <Field
                            id='email'
                            label='Почта:'
                            placeholder='Введите почту: '
                            extra='mb-4'
                        />

                        <label htmlFor='emailType' className='block mb-2'>
                            Тип почты:
                        </label>
                        <select id='emailType' className='block w-full mb-4 p-2 border border-gray-300 rounded'>
                            {emailTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        <Button
                            type='button'

                        >
                            Добавить почту
                        </Button>
                    </div>
                </div>

                <Button type='submit'>
                    Сохранить
                </Button>
            </form>
        </div>
    )
}
