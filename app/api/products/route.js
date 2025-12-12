
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";


export async function GET() {
	await connectDB();
	const products = await Product.find().sort({ createdAt: -1 });
	return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	const body = await req.json();
	await connectDB();
	const product = await Product.create(body);
	return new Response(JSON.stringify(product), { status: 201 });
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
