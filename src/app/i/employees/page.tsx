import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {EmployeesView} from "@/app/i/employees/employeesView";


export const metadata: Metadata = {
	title: 'Сотрудники',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<Heading title='Сотрудники' />
			<EmployeesView />
		</div>
	)
}
