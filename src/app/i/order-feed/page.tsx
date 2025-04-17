import type {Metadata} from 'next'

import {Heading} from '@/components/ui/Heading'

import {NO_INDEX_PAGE} from '@/constants/seo.constants'
import {OrderFeedView} from "@/app/i/order-feed/orderFeedView";


export const metadata: Metadata = {
    title: 'Заказов',
    ...NO_INDEX_PAGE
}

export default function DashboardPage() {
    return (
        <div>
            <OrderFeedView/>
        </div>
    )
}
