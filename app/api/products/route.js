import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from " @/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

export async function GET() {
	await connectDB();
	const products = await Product.find().sort({ createdAt: -1 });
	return new Response(JSON.stringify(products), { status: 200 });
}



export async function POST(req) {
	try {
		await connectDB();

		const data = await req.json();

		// Slugify function
		function slugify(text) {
			return text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");
		}

		const baseSlug = slugify(data.name) + "-tomartbd";
		let slug = baseSlug;

		// Duplicate check (NOW WORKS 🔥)
		let counter = 1;
		let exists = await Product.findOne({ slug });

		while (exists) {
			slug = `${baseSlug}-${counter}`;
			counter++;
			exists = await Product.findOne({ slug });
		}

		// Create product
		const product = new Product({
			...data,
			slug,
			images: data.images || [],
		});

		await product.save();

		return new Response(JSON.stringify({ success: true, product }), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("API ERROR:", err);

		return new Response(
			JSON.stringify({ success: false, error: err.message }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}











export async function PUT(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	const { id, ...data } = await req.json();
	await connectDB();
	const product = await Product.findByIdAndUpdate(id, data, { new: true });
	return new Response(JSON.stringify(product), { status: 200 });
}

export async function DELETE(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	const { id } = await req.json();
	await connectDB();
	await Product.findByIdAndDelete(id);
	return new Response(JSON.stringify({ message: "Deleted" }), {
		status: 200,
	});
}
