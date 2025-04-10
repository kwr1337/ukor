'use client'

import cn from 'clsx'
import Link from 'next/link'

import { IMenuItem } from './menu.interface'

interface MenuItemProps {
	item: IMenuItem
	isActive: boolean
	isCollapsed?: boolean
}

export function MenuItem({ item, isActive, isCollapsed = false }: MenuItemProps) {
	return (
		<div>
			<Link
				href={item.link}
				className={cn(
					'flex items-center gap-2.5 px-layout py-3.5 mt-3 rounded-lg transition-colors',
					{
						'bg-primary': isActive,
						'bg-transparent': !isActive,
						'justify-center': isCollapsed
					}
				)}
			>
				<item.icon size={24} />
				{!isCollapsed && <span>{item.name}</span>}
			</Link>
		</div>
	)
}
