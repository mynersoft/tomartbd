'use client';

import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useOrders } from '@/hooks/useOrder';
import Invoice from '@/components/Order/Invoice';

function InvoiceContent() {
  useOrders();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const orders = useSelector((state) => state.order.orders);

  const orderData = orders.orders;
 

  const order =
    orderData?.length > 0 && orderData.find((o) => o._id === orderId);

  if (!order) return <p>Order not found or still loading...</p>;

  return <Invoice order={order} />;
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<p>Loading order...</p>}>
      <InvoiceContent />
    </Suspense>
  );
}
