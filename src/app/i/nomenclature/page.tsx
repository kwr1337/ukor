import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {NomenclatureView} from "@/app/i/nomenclature/nomenclatureView";


export const metadata: Metadata = {
	title: 'Номенклатура',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<NomenclatureView/>
		</div>
	)
}
