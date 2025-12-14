import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
	try {
		await connectDB();
		const { status } = await req.json();

		const order = await Order.findByIdAndUpdate(
			params.id,
			{ status },
			{ new: true }
		);

		if (!order) {
			return NextResponse.json({ message: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(order, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: "Server Error" }, { status: 500 });
	}
}