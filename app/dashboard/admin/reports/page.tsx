"use client";

import { useProfitReport } from "@/hooks/useProfitReport";

export default function AdminReportsPage() {
	const { data, isLoading } = useProfitReport();

	if (isLoading) return <p className="p-4">Loading reports...</p>;

	return (
		<div className="space-y-6">
			{/* Profit Summary */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ReportCard title="Revenue" value={`৳ ${data.revenue}`} />
				<ReportCard title="Total Cost" value={`৳ ${data.totalCost}`} />
				<ReportCard title="Net Profit" value={`৳ ${data.profit}`} />
			</div>

			{/* Best Sellers */}
			<div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
				<h2 className="text-lg font-bold mb-4">
					Top Selling Products 🔥
				</h2>

				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-800">
							<th className="p-2 text-left">Product</th>
							<th className="p-2 text-left">Sold</th>
							<th className="p-2 text-left">Price</th>
						</tr>
					</thead>
					<tbody>
						{data.bestSellers.map((p: any) => (
							<tr key={p._id._id} className="border-t">
								<td className="p-2 font-semibold">
									{p._id.name}
								</td>
								<td className="p-2">{p.totalSold}</td>
								<td className="p-2">৳ {p._id.price}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function ReportCard({ title, value }: { title: string; value: string }) {
	return (
		<div className="bg-white dark:bg-gray-900 shadow rounded p-6 text-center">
			<p className="text-sm text-gray-500">{title}</p>
			<h3 className="text-2xl font-bold">{value}</h3>
		</div>
	);
}
