import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { generateInvoiceID } from "../../../helper/generateInvoiceID";





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

		const invoiceId = generateInvoiceID();


		const order = await Order.create({
			customer: {
				name: session.user.name,
				email: session.user.email,
				phone: body.phone,
			},
			invoice: invoiceId,
			total: body.totalAmount,
			payment: { method: "COD",status:" unpaid" },
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









