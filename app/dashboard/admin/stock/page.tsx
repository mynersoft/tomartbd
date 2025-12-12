// app/admin/stock/page.tsx
"use client";

import { useStockAlerts } from "@/hooks/useStockAlerts";

export default function StockAlertsPage() {
	const { data: products = [], isLoading } = useStockAlerts();

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6 text-red-600">
				Low Stock Products ⚠️
			</h1>

			{isLoading ? (
				<p>Loading...</p>
			) : products.length === 0 ? (
				<p className="text-green-600">
					All products have enough stock ✅
				</p>
			) : (
				<div className="bg-white shadow rounded overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-red-100">
							<tr>
								<th className="p-3">Product</th>
								<th className="p-3">Current Stock</th>
								<th className="p-3">Threshold</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p: any) => {
								const stock =
									p.variants?.reduce(
										(s: number, v: any) => s + v.stock,
										0
									) || p.stock;

								return (
									<tr key={p._id} className="border-t">
										<td className="p-3 font-medium">
											{p.name}
										</td>
										<td className="p-3 text-red-600 font-bold">
											{stock}
										</td>
										<td className="p-3">
											{p.lowStockThreshold}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
