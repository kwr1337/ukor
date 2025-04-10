'use client'

import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { Sidebar } from './sidebar/Sidebar'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	const pathname = usePathname()

	return (
		<div className='grid min-h-screen' style={{ gridTemplateColumns: 'auto 1fr' }}>
			<Sidebar />
			<main className='p-layout overflow-y-auto max-h-screen w-full'>
				{children}
			</main>
		</div>
	)
}

