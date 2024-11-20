'use client'

import type { PropsWithChildren } from 'react'

import { Header } from './header/Header'
import { Sidebar } from './sidebar/Sidebar'
import { useState } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren<unknown>) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div
			className={`grid min-h-screen transition-all duration-300 ${
				isSidebarOpen
					? 'sm:grid-cols-[0.4fr_3fr] md:grid-cols-[0.6fr_4fr] lg:grid-cols-[1fr_5fr] 2xl:grid-cols-[1.1fr_18fr]'
					: 'sm:grid-cols-[0.2fr_3fr] md:grid-cols-[0.3fr_4fr] lg:grid-cols-[0.5fr_5fr] 2xl:grid-cols-[0.6fr_6fr]'
			}`}
		>
			<Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
			<main
				className={`content-wrapper transition-all duration-300 ${
					isSidebarOpen ? 'p-6' : 'p-4'
				}`}
			>
				<Header/>
				{children}
			</main>
		</div>
	);
}

