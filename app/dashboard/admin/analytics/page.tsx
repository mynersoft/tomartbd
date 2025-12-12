"use client";

import { FaUsers, FaBox, FaShoppingCart } from "react-icons/fa";
import { useAnalytics } from "@/hooks/useAnalytics";
import SalesChart from "@/components/Dashboard/SalesChart";

export default function AnalyticsPage() {
	const { data, isLoading } = useAnalytics();

	if (isLoading) return <p className="p-4">Loading analytics...</p>;

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Stat
					title="Orders"
					value={data.totalOrders}
					icon={<FaShoppingCart />}
				/>
				<Stat
					title="Users"
					value={data.totalUsers}
					icon={<FaUsers />}
				/>
				<Stat
					title="Products"
					value={data.totalProducts}
					icon={<FaBox />}
				/>
			</div>

			<div className="mt-6 bg-white dark:bg-gray-900 p-4 rounded shadow">
				<SalesChart data={data.salesData} />
			</div>
		</div>
	);
}

function Stat({
	title,
	value,
	icon,
}: {
	title: string;
	value: number;
	icon: React.ReactNode;
}) {
	return (
		<div className="bg-white dark:bg-gray-900 shadow p-6 rounded flex items-center justify-between">
			<div>
				<p className="text-sm text-gray-500">{title}</p>
				<h3 className="text-2xl font-bold">{value}</h3>
			</div>
			<div className="text-3xl text-blue-600">{icon}</div>
		</div>
	);
}
