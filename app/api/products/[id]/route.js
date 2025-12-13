import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
	try {
		await connectDB();

		const { id } = params; // <- DO NOT overwrite this
		console.log("Product ID from params:", id);

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return new Response(
				JSON.stringify({ success: false, error: "Invalid product ID" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			return new Response(
				JSON.stringify({ success: false, error: "Product not found" }),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Product deleted",
				product,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (err) {
		console.error("DELETE PRODUCT ERROR:", err);
		return new Response(
			JSON.stringify({ success: false, error: err.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
