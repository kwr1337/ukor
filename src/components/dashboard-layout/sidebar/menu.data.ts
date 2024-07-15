import {
	BookCheck,
	CalendarRange,
	KanbanSquare,
	LayoutDashboard,
	Settings,
	Timer
} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import type { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		link: DASHBOARD_PAGES.SUMMARY,
		name: 'Сводка'
	},
	{
		link: DASHBOARD_PAGES.ORDER_FEED,
		name: 'Лента заказов'
	},
	{
		link: DASHBOARD_PAGES.SUPPLIES,
		name: 'Поставки'
	},
	{
		link: DASHBOARD_PAGES.REVERS_IMPLEMENTATION,
		name: 'Обратная реализация'
	},
	{
		link: DASHBOARD_PAGES.NOMENCLATURE,
		name: 'Номенклатура'
	},
	{
		link: DASHBOARD_PAGES.PRICING,
		name: 'Ценообразование'
	},
	{
		link: DASHBOARD_PAGES.MAIL,
		name: 'Почта'
	},
	{
		link: DASHBOARD_PAGES.REPORTS,
		name: 'Отчеты'
	},
	{
		link: DASHBOARD_PAGES.BLACK_LIST,
		name: 'Черный список'
	},
	{
		link: DASHBOARD_PAGES.COUNTERPARTIES,
		name: 'Контрагенты'
	},
	{
		link: DASHBOARD_PAGES.EMPLOYEES,
		name: 'Сотрудники'
	}
]
