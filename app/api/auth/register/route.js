import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "../../../../lib/db";

export async function POST(req) {
	await connectDB();
	const { name, email, password, role } = await req.json();

	if (!name || !email || !password) {
		return NextResponse.json(
			{ error: "All fields required" },
			{ status: 400 }
		);
	}

	const existing = await User.findOne({ email });
	if (existing)
		return NextResponse.json(
			{ error: "Email already used" },
			{ status: 400 }
		);

	const hashed = await bcrypt.hash(password, 10);

	const user = await User.create({
		name,
		email,
		password: hashed,
		role: role || "user",
	});

	return NextResponse.json({
		success: true,
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});
}
