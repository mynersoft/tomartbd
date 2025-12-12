"use client";

import { useUserOrders } from "@/hooks/useUserOrders";

export default function UserOrdersPage() {
	const { data: orders, isLoading } = useUserOrders();

	if (isLoading) return <p className="p-4">Loading orders...</p>;
	if (!orders || orders.length === 0)
		return <p className="p-4">No orders found.</p>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">My Orders</h1>
			<div className="space-y-4">
				{orders.map((order: any) => (
					<div
						key={order._id}
						className="border rounded p-4 bg-white shadow">
						<div className="flex justify-between mb-2">
							<span className="font-semibold">
								Order ID: {order._id}
							</span>
							<span>
								Status:{" "}
								<span
									className={`font-bold ${getStatusColor(
										order.status
									)}`}>
									{order.status}
								</span>
							</span>
						</div>
						<div className="mb-2">
							{order.items.map((item: any) => (
								<div
									key={item.product._id}
									className="flex justify-between py-1 border-b">
									<span>
										{item.product.name} x {item.quantity}
									</span>
									<span>৳ {item.price * item.quantity}</span>
								</div>
							))}
						</div>
						<div className="text-right font-bold">
							Total: ৳ {order.total}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Utility to color order status
function getStatusColor(status: string) {
	switch (status) {
		case "Pending":
			return "text-yellow-500";
		case "Processing":
			return "text-blue-500";
		case "Shipped":
			return "text-orange-500";
		case "Delivered":
			return "text-green-500";
		case "Cancelled":
			return "text-red-500";
		default:
			return "text-gray-500";
	}
}
