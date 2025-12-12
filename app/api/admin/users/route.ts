// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
	await connectDB();

	const url = new URL(req.url);
	const page = Number(url.searchParams.get("page") || 1);
	const limit = Number(url.searchParams.get("limit") || 10);
	const search = url.searchParams.get("search") || "";

	const query = search ? { name: { $regex: search, $options: "i" } } : {};

	const total = await User.countDocuments(query);
	const pages = Math.ceil(total / limit);
	const users = await User.find(query)
		.skip((page - 1) * limit)
		.limit(limit)
		.sort({ createdAt: -1 });

	return NextResponse.json({ users, total, pages });
}

export async function POST(req: Request) {
	await connectDB();
	const { name, email, password, role } = await req.json();

	const existingUser = await User.findOne({ email });
	if (existingUser)
		return NextResponse.json({ error: "User exists" }, { status: 400 });

	const user = await User.create({ name, email, password, role });
	return NextResponse.json({ user });
}
