import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {ReportsView} from "@/app/i/reports/reportsView";


export const metadata: Metadata = {
	title: 'Отчеты',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<Heading title='Отчеты' />
			<ReportsView/>
		</div>
	)
}
