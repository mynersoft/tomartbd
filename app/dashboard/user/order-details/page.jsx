"use client";

import { useOrder } from "@/hooks/useOrders";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
	const params = useParams<{ id: string }>();
	const id = params?.id || "";

	const { data: order, isLoading } = useOrder(id);

	if (isLoading) return <p className="p-4">Loading order details...</p>;
	if (!order) return <p className="p-4">Order not found.</p>;

	const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Order Details</h1>

			<div className="border rounded bg-white p-4 shadow">
				<div className="mb-4">
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
						{order.items?.map((item: any) => (
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

				{/* Shipment tracking */}
				<div className="mt-6">
					<h2 className="font-semibold mb-2">Shipment Progress</h2>

					<div className="flex items-center space-x-4">
						{statusSteps.map((step, idx) => (
							<div key={idx} className="flex-1 text-center">
								<div
									className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center font-bold
									${
										statusSteps.indexOf(order.status) >= idx
											? "bg-green-500 text-white"
											: "bg-gray-300 text-gray-600"
									}`}>
									{idx + 1}
								</div>
								<span className="block mt-2 text-sm">
									{step}
								</span>

								{idx < statusSteps.length - 1 && (
									<div
										className={`h-1 mt-1 w-full ${
											statusSteps.indexOf(order.status) >
											idx
												? "bg-green-500"
												: "bg-gray-300"
										}`}></div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

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
