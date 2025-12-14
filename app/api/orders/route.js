import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import {authOptions}  from "@/lib/auth";

export async function POST(req) {
	await connectDB();

	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await req.json();

	const order = await Order.create({
		user: session.user.id,
		products: body.products,
		totalAmount: body.totalAmount,
		status: "pending",
	});

	return new Response(JSON.stringify(order), { status: 201 });
}