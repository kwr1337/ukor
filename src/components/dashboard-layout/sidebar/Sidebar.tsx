'use client'

import { ChevronsLeft, ChevronsRight, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

const SIDEBAR_STATE_KEY = 'sidebar-collapsed'

type SidebarProps = {
	isOpen: boolean;
	onToggle: () => void;
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
	// Инициализация состояния из localStorage, если значение есть
	const [isCollapsed, setIsCollapsed] = useState(() => {
		// Получаем состояние из localStorage, если его нет, по умолчанию раскрыта
		if (typeof window !== 'undefined') {
			const storedState = localStorage.getItem(SIDEBAR_STATE_KEY)
			return storedState === 'true' // Если storedState равен 'true', то панель скрыта
		}
		return false
	})

	// Функция для изменения состояния боковой панели и сохранения в localStorage
	const toggleSidebar = () => {
		setIsCollapsed(prevState => {
			const newState = !prevState
			localStorage.setItem(SIDEBAR_STATE_KEY, newState.toString()) // Сохранение нового состояния в localStorage
			return newState
		})
	}

	useEffect(() => {
		// Синхронизация состояния с localStorage при первой загрузке компонента
		const storedState = localStorage.getItem(SIDEBAR_STATE_KEY)
		if (storedState !== null) {
			setIsCollapsed(storedState === 'true')
		}
	}, [])

	return (
		<div className='flex h-full'>
			{/* Боковое меню */}
			<aside
				className={`border-r border-r-border h-full bg-sidebar flex flex-col justify-between transition-all duration-300 ${
					isCollapsed ? 'w-24' : 'w-64'
				}`}
			>
				<div>
					<div
						className={`flex items-center gap-2.5 p-layout border-b border-b-border ${isCollapsed ? 'justify-center' : 'justify-between'}`}
					>
						<Link
							href='/'
							className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}
						>
							<span
								className={`text-2xl font-bold relative transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-2xl'}`}
							>
								Ukor Auto
								<span
									className={`absolute ${isCollapsed ? 'hidden' : 'block'} -top-1 -right-6 text-xs opacity-40 rotate-[18deg] font-normal`}
								>
									beta
								</span>
							</span>
						</Link>
						<button
							onClick={toggleSidebar}
							className='p-1 bg-border hover:bg-border-hover rounded transition-all duration-200'
						>
							{isCollapsed ? (
								<ChevronsRight size={20} />
							) : (
								<ChevronsLeft size={20} />
							)}
						</button>
					</div>
					<div className='p-3 relative'>
						<LogoutButton />
						{MENU.map(item => (
							<Link
								href={item.link}
								key={item.link}
								className={`flex items-center gap-2 p-2 my-1 rounded transition-all duration-200 ${
									isCollapsed ? 'justify-center' : ''
								} hover:bg-border-hover`}
								title={isCollapsed ? item.name : ''}
							>
								<item.icon size={20} />
								<span className={`${isCollapsed ? 'hidden' : 'block'}`}>
									{item.name}
								</span>
							</Link>
						))}
					</div>
				</div>
				<div />
			</aside>
		</div>
	)
}
