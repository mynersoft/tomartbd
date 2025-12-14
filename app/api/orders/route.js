import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
	try {
		await connectDB();

		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { products } = body;

		if (!products || products.length === 0) {
			return NextResponse.json(
				{ message: "No products found" },
				{ status: 400 }
			);
		}

		// 🔐 Recalculate total securely from DB
		let totalAmount = 0;

		const validatedProducts = await Promise.all(
			products.map(async (item) => {
				const product = await Product.findById(item.productId);

				if (!product) {
					throw new Error("Product not found");
				}

				const price = product.discount
					? product.price * ((100 - product.discount) / 100)
					: product.price;

				totalAmount += price * item.quantity;

				return {
					productId: product._id,
					quantity: item.quantity,
					price,
				};
			})
		);

		const order = await Order.create({
			user: session.user.id,
			products: validatedProducts,
			totalAmount,
			status: "pending",
		});

		return NextResponse.json(
			{ message: "Order placed", order },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Order failed" },
			{ status: 500 }
		);
	}
}