import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


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

		const order = await Order.create({
			customer: {
				name: session.user.name,
				email: session.user.email,
				phone: body.phone,
			},
			total: body.totalAmount,
			payment: {
				method: "cash_on_delivery",
			},
			shipping: {
				address: body.address,
				city: body.city,
				phone: body.phone,
			},
			orderItems: body.products,
			userId: session.user.id, // ✅ now exists
		});

		return NextResponse.json({ success: true, order });
	} catch (error) {
		console.error("ORDER ERROR:", error);
		return NextResponse.json(
			{ message: "Server error" },
			{ status: 500 }
		);
	}
}
