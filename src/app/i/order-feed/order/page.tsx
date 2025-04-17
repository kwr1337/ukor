import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {OrderDetailView} from "@/app/i/order-feed/order/OrderDetailView";



export const metadata: Metadata = {
	title: 'Заказ',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>

			<OrderDetailView/>
		</div>
	)
}
