import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {RevImpView} from "@/app/i/reverse-implementation/revImpView";
import {ReturnOrderView} from "@/app/i/reverse-implementation/return-order/ReturnOrderView";


export const metadata: Metadata = {
	title: 'Обратная реализация',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<Heading title={"Возврат"}/>
			<ReturnOrderView/>
		</div>
	)
}
