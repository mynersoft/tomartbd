import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET() {
	await connectDB();

	const totalOrders = await Order.countDocuments();
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: {
					$month: "$createdAt",
				},
				total: { $sum: "$total" },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	return NextResponse.json({
		totalOrders,
		totalUsers,
		totalProducts,
		salesData,
	});
}
