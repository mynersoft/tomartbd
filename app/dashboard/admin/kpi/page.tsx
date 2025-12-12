"use client";

import { useKpi } from "@/hooks/useKpi";

export default function AdminKpiPage() {
	const { data, isLoading } = useKpi();

	if (isLoading) return <p className="p-4">Loading KPI...</p>;

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<KpiCard title="Orders" value={data.totalOrders} />
				<KpiCard title="Users" value={data.totalUsers} />
				<KpiCard title="Products" value={data.totalProducts} />
				<KpiCard title="Revenue" value={`৳ ${data.revenue}`} />
				<KpiCard title="Today Sales" value={`৳ ${data.todaySales}`} />
			</div>

			<div className="bg-white dark:bg-gray-900 rounded shadow p-4">
				<h2 className="text-lg font-bold mb-4">Latest Orders</h2>

				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-800">
							<th className="p-2 text-left">Invoice</th>
							<th className="p-2 text-left">Customer</th>
							<th className="p-2 text-left">Amount</th>
							<th className="p-2 text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{data.recentOrders.map((o: any) => (
							<tr key={o._id} className="border-t">
								<td className="p-2">#{o._id.slice(-6)}</td>
								<td className="p-2">
									{o.user?.name || "Guest"}
								</td>
								<td className="p-2">৳ {o.total}</td>
								<td className="p-2 font-semibold">
									{o.status}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function KpiCard({ title, value }: { title: string; value: string | number }) {
	return (
		<div className="bg-white dark:bg-gray-900 shadow p-4 rounded text-center">
			<p className="text-sm text-gray-500">{title}</p>
			<h3 className="text-2xl font-bold mt-1">{value}</h3>
		</div>
	);
}
