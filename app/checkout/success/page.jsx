"use client";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/hooks/useOrder";
import Invoice from "../../../components/Order/Invoice";

export default function InvoicePage() {
	useOrders();
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");

	const orders = useSelector((state) => state.order.orders);

	const order = orders.length > 0 && orders?.find((o) => o._id === orderId);

	if (!order) return <p>Order not found or still loading...</p>;

	
	return <Invoice order={order} />;
}
