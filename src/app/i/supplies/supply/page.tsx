import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {SuppliesView} from "@/app/i/supplies/suppliesView";
import {SupplyView} from "@/app/i/supplies/supply/supplyView";


export const metadata: Metadata = {
	title: 'Поставки',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<SupplyView/>
		</div>
	)
}
