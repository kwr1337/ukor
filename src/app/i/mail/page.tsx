import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import {MailView} from "@/app/i/mail/mailView";


export const metadata: Metadata = {
	title: 'Почта',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div>
			<MailView/>
		</div>
	)
}
