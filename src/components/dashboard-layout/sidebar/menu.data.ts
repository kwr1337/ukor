import {
	BookCheck,
	CalendarRange,
	KanbanSquare,
	LayoutDashboard,
	Settings,
	Timer,
	Mail,
	ClipboardList,
	ShieldAlert,
	Users,

} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import type { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	// {
	// 	link: DASHBOARD_PAGES.SUMMARY,
	// 	name: 'Сводка',
	// 	icon: LayoutDashboard
	// },
	{
		link: DASHBOARD_PAGES.LEFTOVERS,
		name: 'Склады',
		icon: Settings
	},
	{
		link: DASHBOARD_PAGES.ORDER_FEED,
		name: 'Заказы',
		icon: ClipboardList
	},
	// {
	// 	link: DASHBOARD_PAGES.SUPPLIES,
	// 	name: 'Поставки',
	// 	icon: Settings
	// },
	// {
	// 	link: DASHBOARD_PAGES.REVERS_IMPLEMENTATION,
	// 	name: 'Обратная реализация',
	// 	icon: CalendarRange
	// },
	{
		link: DASHBOARD_PAGES.NOMENCLATURE,
		name: 'Номенклатура',
		icon: BookCheck
	},
	{
		link: DASHBOARD_PAGES.PRICING,
		name: 'Ценообразование',
		icon: Timer
	},
	// {
	// 	link: DASHBOARD_PAGES.MAIL,
	// 	name: 'Почта',
	// 	icon: Mail
	// },
	// {
	// 	link: DASHBOARD_PAGES.REPORTS,
	// 	name: 'Отчеты',
	// 	icon: BookCheck
	// },
	// {
	// 	link: DASHBOARD_PAGES.BLACK_LIST,
	// 	name: 'Черный список',
	// 	icon: ShieldAlert
	// },
	{
		link: DASHBOARD_PAGES.COUNTERPARTIES,
		name: 'Контрагенты',
		icon: Users
	},
	// {
	// 	link: DASHBOARD_PAGES.EMPLOYEES,
	// 	name: 'Сотрудники',
	// 	icon: Users
	// },

]
