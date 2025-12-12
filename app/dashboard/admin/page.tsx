"use client";

import { FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import StatsCard from "@/components/Dashboard/StatsCard";
import SalesChart from "@/components/Dashboard/SalesChart";
import RecentOrders from "@/components/Dashboard/RecentOrders"

export default function AdminDashboard() {
	const orders = [
		{
			id: 1,
			invoice: "INV001",
			customer: "Mahir",
			total: 100,
			status: "Paid",
		},
		{
			id: 2,
			invoice: "INV002",
			customer: "Alice",
			total: 200,
			status: "Pending",
		},
	];
const data = [
	{ month: "Jan", sales: 1200 },
	{ month: "Feb", sales: 2100 },
	{ month: "Mar", sales: 800 },
	{ month: "Apr", sales: 1600 },
	{ month: "May", sales: 900 },
	{ month: "Jun", sales: 1700 },
	{ month: "Jul", sales: 2400 },
	{ month: "Aug", sales: 1300 },
	{ month: "Sep", sales: 2000 },
	{ month: "Oct", sales: 1500 },
	{ month: "Nov", sales: 2200 },
	{ month: "Dec", sales: 1900 },
];

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatsCard
					title="Total Sales"
					value="$12,000"
					icon={<FaShoppingCart />}
				/>
				<StatsCard title="Total Users" value="150" icon={<FaUsers />} />
				<StatsCard title="Products" value="85" icon={<FaBox />} />
			</div>

			<div className="mt-6 bg-white shadow rounded p-4">
				<SalesChart data={data || []} />
			</div>

			<RecentOrders orders={orders} />
		</div>
	);
}
