import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

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

export async function DELETE(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}
		const url = new URL(req.url);
		const pathname = url.pathname;
		const parts = pathname.split("/");
		const id = parts[parts.length - 1];


		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Invalid order ID" },
				{ status: 400 }
			);
		}

		await connectDB();

		const order = await Order.findById(id);

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);


		if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: Admin access required",
        },
        { status: 403 }
      );
    }
		await Order.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: "Order deleted successfully",
		});
	} catch (error) {
		console.error("DELETE ERROR:", error);

		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
