import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {CounterPartiesView} from "@/app/i/counterparties/counterpartiesView";


export const metadata: Metadata = {
	title: 'Контрагенты',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<CounterPartiesView/>
		</div>
	)
}
