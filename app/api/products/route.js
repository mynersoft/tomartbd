import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET
export async function GET() {
	await connectDB();
	const products = await Product.find().sort({ createdAt: -1 });
	return Response.json(products);
}

// POST
export async function POST(req) {
	try {
		await connectDB();
		const data = await req.json();

		const slugify = (text) =>
			text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");

		const baseSlug = slugify(data.name) + "-tomartbd";
		let slug = baseSlug;

		let counter = 1;
		while (await Product.findOne({ slug })) {
			slug = `${baseSlug}-${counter++}`;
		}

		const product = await Product.create({
			...data,
			slug,
			images: data.images || [],
		});

		return Response.json({ success: true, product }, { status: 201 });
	} catch (err) {
		return Response.json(
			{ success: false, error: err.message },
			{ status: 500 }
		);
	}
}

// PUT (Admin only)
export async function PUT(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	await connectDB();
	const { id, ...data } = await req.json();
	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	return Response.json(product);
}

// DELETE (Admin only)
export async function DELETE(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	await connectDB();
	const { id } = await req.json();
	await Product.findByIdAndDelete(id);

	return Response.json({ message: "Deleted" });
}
