import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {SummaryView} from "@/app/i/summary/summaryView";


export const metadata: Metadata = {
	title: 'Сводка',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<SummaryView/>
		</div>
	)
}
