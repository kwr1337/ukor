'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'
import { useUpdateSettings } from './useUpdateSettings'

export function Settings() {


	const { isPending, mutate } = useUpdateSettings()


	return (
		<div>
			<form
				className='w-2/4'
			>
				<div className='grid grid-cols-3 gap-10'>
					<div>
						<Field
							id='surname'
							label='Фамилия: '
							placeholder='Введите фамилию: '
							extra='mb-4'
						/>

						<Field
							id='post'
							label='Должность: '
							placeholder='Введите должность: '
							extra='mb-4'
						/>

						<Field
							id='login'
							label='Логин: '
							placeholder='Введите логин: '
							extra='mb-10'
						/>
					</div>

					<div>
						<Field
							id='name'
							label='Имя: '
							placeholder='Введите имя: '
							extra='mb-4'
						/>

						<Field
							id='phone'
							label='Телефон:'
							placeholder='Введите телефон: '
							isNumber
							extra='mb-4'
						/>

						<Field
							id='password'
							label='Пароль: '
							placeholder='Введите пароль: '
							type='password'
							extra='mb-10'
						/>
					</div>

					<div>
						<Field
							id='otchestvo'
							label='Отчество: '
							placeholder='Введите отчество: '
							extra='mb-4'
						/>

						<Field
							id='email'
							label='Почта:'
							placeholder='Введите почту: '
							extra='mb-4'
						/>

					</div>
				</div>

				<Button
					type='submit'
					disabled={isPending}
				>
					Сохранить
				</Button>
			</form>
		</div>
	)
}
