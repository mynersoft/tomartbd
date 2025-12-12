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

	const revenueAgg = await Order.aggregate([
		{ $group: { _id: null, total: { $sum: "$total" } } },
	]);

	const revenue = revenueAgg[0]?.total || 0;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const todaySalesAgg = await Order.aggregate([
		{ $match: { createdAt: { $gte: today } } },
		{ $group: { _id: null, total: { $sum: "$total" } } },
	]);

	const todaySales = todaySalesAgg[0]?.total || 0;

	const recentOrders = await Order.find()
		.sort({ createdAt: -1 })
		.limit(5)
		.populate("user");

	return NextResponse.json({
		totalOrders,
		totalUsers,
		totalProducts,
		revenue,
		todaySales,
		recentOrders,
	});
}
