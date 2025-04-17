import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {CounterpartyView} from "@/app/i/counterparties/counterparty/counterpartyView";


export const metadata: Metadata = {
	title: 'Контрагенты',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<Heading title={"Контрагент"}/>
			<CounterpartyView/>
		</div>
	)
}
