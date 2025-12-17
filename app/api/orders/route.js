import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET() {
	await connectDB();
	const orders = await Order.find().sort({ createdAt: -1 });
	return NextResponse.json(orders);
}

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		if (!body.address || !body.phone) {
			return NextResponse.json(
				{ message: "Missing fields" },
				{ status: 400 }
			);
		}

		await connectDB();

		// const data = {
		// 	orderId: "ORD-0000111",
		// 	customer: {
		// 		name: "John Doe",
		// 		email: "johndoe@example.com",
		// 		phone: "0123456789",
		// 	},
		// 	total: 250,
		// 	status: "pending",
		// 	payment: {
		// 		method: "cash_on_delivery",
		// 		status: "pending",
		// 	},
		// 	shipping: {
		// 		address: "123 Main Street",
		// 		city: "Dhaka",
		// 		phone: "0123456789",
		// 	},
		// 	orderItems: [
		// 		{
		// 			productId: "64a1234567890abcdef12345",
		// 			name: "Product 1",
		// 			quantity: 2,
		// 			price: 50,
		// 		},
		// 		{
		// 			productId: "64a1234567890abcdef67890",
		// 			name: "Product 2",
		// 			quantity: 3,
		// 			price: 50,
		// 		},
		// 	],
		// 	userId: "693573a2de7b43ad7ee5dcb7",
		// 	createdAt: "2025-12-17T06:30:00.000Z",
		// 	updatedAt: "2025-12-17T06:30:00.000Z",
		// };

		const order = await Order.create({
			customer: {
				name: session.user.name,
				email: session.user.email,
				phone: body.phone,
			},
			total: body.totalAmount,
			payment: { method: "cash_on_delivery" },
			shipping: {
				address: body.address,
				city: body.city,
				phone: body.phone,
			},
			orderItems: body.products,
			userId: new mongoose.Types.ObjectId(session.user.id),
		});

		return NextResponse.json({ success: true, order });
	} catch (error) {
		console.error("ORDER ERROR:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
