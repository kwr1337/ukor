import type {Metadata} from 'next'

import {Heading} from '@/components/ui/Heading'

import {NO_INDEX_PAGE} from '@/constants/seo.constants'
import {LeftoversView} from "@/app/i/leftovers/leftoversView";


export const metadata: Metadata = {
    title: 'Склады',
    ...NO_INDEX_PAGE
}

export default function DashboardPage() {
    return (
        <div>
            <LeftoversView/>
        </div>
    )
}
