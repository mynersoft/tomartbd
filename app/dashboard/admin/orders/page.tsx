"use client";

import { useState } from "react";
import { useOrders, useUpdateOrder, useDeleteOrder } from "@/hooks/useOrders";
import { Toaster } from "react-hot-toast";

// ✅ Order Type
type Order = {
	_id: string;
	invoice: string;
	customer: string;
	email: string;
	total: number;
	status: string;
};

export default function AdminOrdersPage() {
	const { data: orders = [], isLoading } = useOrders();
	const updateOrder = useUpdateOrder();
	const deleteOrder = useDeleteOrder();
	const [search, setSearch] = useState<string>("");

	if (isLoading) return <p className="p-4">Loading orders...</p>;

	// ✅ Now TypeScript knows what `order` is
	const filteredOrders = orders.filter((order: Order) => {
		return (
			order.customer.toLowerCase().includes(search.toLowerCase()) ||
			order.invoice.toLowerCase().includes(search.toLowerCase())
		);
	});

	return (
		<div className="p-6">
			<Toaster position="top-right" />

			<h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>

			{/* Search */}
			<input
				type="text"
				placeholder="Search by customer or invoice"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="border rounded px-3 py-2 mb-4 w-full max-w-md"
			/>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border rounded shadow">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 border">Invoice</th>
							<th className="px-4 py-2 border">Customer</th>
							<th className="px-4 py-2 border">Email</th>
							<th className="px-4 py-2 border">Total</th>
							<th className="px-4 py-2 border">Status</th>
							<th className="px-4 py-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order: Order) => (
							<tr key={order._id}>
								<td className="px-4 py-2 border">
									{order.invoice}
								</td>
								<td className="px-4 py-2 border">
									{order.customer}
								</td>
								<td className="px-4 py-2 border">
									{order.email}
								</td>
								<td className="px-4 py-2 border">
									${order.total.toFixed(2)}
								</td>
								<td className="px-4 py-2 border">
									<select
										value={order.status}
										onChange={(e) =>
											updateOrder.mutate({
												id: order._id,
												data: {
													status: e.target.value,
												},
											})
										}
										className="border rounded px-2 py-1">
										<option value="Pending">Pending</option>
										<option value="Paid">Paid</option>
										<option value="Canceled">
											Canceled
										</option>
									</select>
								</td>
								<td className="px-4 py-2 border">
									<button
										onClick={() =>
											deleteOrder.mutate(order._id)
										}
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
