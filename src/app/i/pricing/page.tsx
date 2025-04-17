import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {PricingView} from "@/app/i/pricing/pricingView";

export const metadata: Metadata = {
	title: 'Ценообразование',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<PricingView/>
		</div>
	)
}
