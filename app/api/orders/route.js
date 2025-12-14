import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		// 1️⃣ Connect DB
		await connectDB();

		// 2️⃣ Check session
		const session = await getServerSession(authOptions);

console.log(session);


		if (!session || !session.user?.id) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// 3️⃣ Parse body safely
		const body = await req.json();

		if (!body.products || body.products.length === 0) {
			return NextResponse.json(
				{ message: "Products are required" },
				{ status: 400 }
			);
		}

		if (!body.totalAmount || body.totalAmount <= 0) {
			return NextResponse.json(
				{ message: "Invalid total amount" },
				{ status: 400 }
			);
		}

		// 4️⃣ Create order
		const order = await Order.create({
			user: session.user.id,
			products: body.products,
			totalAmount: body.totalAmount,
			status: "pending",
		});

		// 5️⃣ Success response
		return NextResponse.json(order, { status: 201 });

	} catch (error) {
		// 6️⃣ Error logging
		console.error("ORDER CREATE ERROR:", error);

		// 7️⃣ Safe error response
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}