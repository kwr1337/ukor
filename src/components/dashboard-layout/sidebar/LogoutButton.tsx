'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'

export function LogoutButton({ isCollapsed = false }) {
	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			push('/auth')
		}
	})

	return (
		<div>
			<button
				className='flex items-center gap-2.5 px-layout py-3.5 mt-3 rounded-lg transition-colors hover:bg-primary'
				onClick={() => mutate()}
			>
				<LogOut size={24} />
				{!isCollapsed && <span>Выйти</span>}
			</button>
		</div>
	)
}
