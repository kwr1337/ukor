'use client'

import { useParams } from 'next/navigation'
import { HistoryView } from './HistoryView'

export default function OrderHistoryPage() {
  const params = useParams()
  const orderId = params.id as string
  
  return <HistoryView orderId={orderId} />
} 