'use client'

import { useRouter } from 'next/navigation'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { useProfile } from '@/hooks/useProfile'

export function Profile() {
	const { data, isLoading } = useProfile()

	const router = useRouter()

	const rout = () => {
		router.push(DASHBOARD_PAGES.PROFILE)
	}
	return (
		<div className='absolute top-big-layout right-big-layout'>
			<div className='flex items-center'>
				{/*<div className='text-right mr-3'>*/}
				{/*	<p className='font-bold -mb-1'>{data?.user.name}</p>*/}
				{/*	<p className='text-sm opacity-40'>{data?.user.email}</p>*/}
				{/*</div>*/}

				{/*<div className='w-10 h-10 flex justify-center items-center text-2xl text-white bg-white/20 rounded uppercase'>*/}
				{/*	{data?.user.name?.charAt(0) || 'A'}*/}
				{/*</div>*/}

				{/*<Button onClick={rout}> Профиль</Button>*/}
			</div>
		</div>
	)
}
