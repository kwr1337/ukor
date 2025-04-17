import Link from 'next/link';
import {OrderDetailView} from "@/app/i/order-feed/order/OrderDetailView";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Детали заказа #{params.id}</h1>
        <div className="flex gap-4">
          <Link 
            href={`/i/order-feed/history/${params.id}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            История изменений
          </Link>
        </div>
      </div>
      <OrderDetailView />
    </div>
  );
} 