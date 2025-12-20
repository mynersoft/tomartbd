import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { generateInvoiceID } from "../../../helper/generateInvoiceID";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { ApiError } from "@/lib/ApiError";

export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();

		let orders;

		if (session.user.role === "admin") {
			// Admin can see all orders
			orders = await Order.find().sort({ createdAt: -1 });
		} else {
			// User can see only their own orders
			orders = await Order.find({ userId: session.user.id }).sort({
				createdAt: -1,
			});
		}

		return NextResponse.json({ success: true, orders });
	} catch (error) {
		console.error("GET ORDERS ERROR:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export const POST = withErrorHandler(async (req) => {
	// 🔐 Auth check
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new ApiError("Unauthorized", 401);
	}

	// 📦 Request body
	const body = await req.json();
	const { address, phone, city, products, totalAmount } = body;

	if (!address || !phone || !products || !totalAmount) {
		throw new ApiError("Missing required fields", 400);
	}

	// 🔌 Connect DB
	await connectDB();

	// 🧾 Invoice
	const invoiceId = generateInvoiceID();

	// 🛒 Create Order
	const order = await Order.create({
		customer: {
			name: session.user.name,
			email: session.user.email,
			phone,
		},
		invoice: invoiceId,
		total: totalAmount,
		payment: {
			method: "COD",
			status: "unpaid",
		},
		shipping: {
			address,
			city,
			phone,
		},
		orderItems: products,
		userId: new mongoose.Types.ObjectId(session.user.id),
	});

	// ✅ Success response
	return NextResponse.json(
		{
			success: true,
			message: "Order created successfully",
			order,
		},
		{ status: 201 }
	);
});
