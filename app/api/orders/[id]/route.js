import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
	await connectDB();
	const { status } = await req.json();

	const order = await Order.findByIdAndUpdate(
		params.id,
		{ status },
		{ new: true }
	);

	return Response.json(order);
}





export async function DELETE(req, context) {
	try {
		// Destructure params correctly
		 const { params } = context;
		const id = params?.id;

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Invalid order ID" },
				{ status: 400 }
			);
		}

		await connectDB();

		const deletedOrder = await Order.findByIdAndDelete(id);

		if (!deletedOrder) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Order deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
