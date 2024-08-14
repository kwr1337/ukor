import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {BlacklistView} from "@/app/i/black-list/blacklistView";



export const metadata: Metadata = {
	title: 'Черный список',
	...NO_INDEX_PAGE
}

export default function SettingsPage() {
	return (
		<div>
			<Heading title='Черный список' />
			<BlacklistView/>
		</div>
	)
}
