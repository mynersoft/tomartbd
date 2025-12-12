import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
	await connectDB();

	// Total Revenue
	const revenueAgg = await Order.aggregate([
		{ $group: { _id: null, total: { $sum: "$total" } } },
	]);

	const revenue = revenueAgg[0]?.total || 0;

	// Cost of products
	const orders = await Order.find().populate("items.product");

	let totalCost = 0;

	orders.forEach((order: any) => {
		order.items.forEach((item: any) => {
			const cost = (item.product?.costPrice || 0) * item.quantity;
			totalCost += cost;
		});
	});

	const profit = revenue - totalCost;

	// Best Selling Products
	const bestSellers = await Order.aggregate([
		{ $unwind: "$items" },
		{
			$group: {
				_id: "$items.product",
				totalSold: { $sum: "$items.quantity" },
			},
		},
		{ $sort: { totalSold: -1 } },
		{ $limit: 10 },
	]);

	const populatedBestSellers = await Product.populate(bestSellers, {
		path: "_id",
		select: "name price",
	});

	return NextResponse.json({
		revenue,
		totalCost,
		profit,
		bestSellers: populatedBestSellers,
	});
}
