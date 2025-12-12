"use client";

import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";

export default function LiveOrdersPage() {
	const { orders } = useRealtimeOrders();

	return (
		<div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Live Orders 🔥</h1>

			<table className="w-full text-sm">
				<thead>
					<tr className="bg-gray-100 dark:bg-gray-800">
						<th className="p-2 text-left">Order</th>
						<th className="p-2 text-left">Customer</th>
						<th className="p-2 text-left">Total</th>
						<th className="p-2 text-left">Status</th>
					</tr>
				</thead>

				<tbody>
					{orders.map((o: any) => (
						<tr key={o._id} className="border-t">
							<td className="p-2">#{o._id.slice(-6)}</td>
							<td className="p-2">{o.user?.name || "Guest"}</td>
							<td className="p-2">৳ {o.total}</td>
							<td className="p-2 font-semibold text-green-600">
								{o.status}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
