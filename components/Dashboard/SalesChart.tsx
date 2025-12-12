"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export default function SalesChart({ data = [] }: { data?: any[] }) {
	

	return (
		<div className="w-full h-72">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="sales" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
