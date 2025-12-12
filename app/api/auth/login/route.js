import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "../../../../lib/db";

export async function POST() {
	await connectDB();

	const { email, password } = await req.json();
	const cleanPassword = password.trim();

	const user = await User.findOne({ email });
	if (!user) {
		return NextResponse.json(
			{ success: false, message: "Invalid email" },
			{ status: 400 }
		);
	}

	const match = await bcrypt.compare(cleanPassword, user.password);
	if (!match) {
		return NextResponse.json(
			{ success: false, message: "Invalid password" },
			{ status: 400 }
		);
	}

	const token = signToken({
		id: user._id.toString(),
		role: user.role,
		name: user.name,
		email: user.email,
	});

	const res = NextResponse.json({
		success: true,
		user: {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});

	res.cookies.set("token", token, {
		httpOnly: true,
		secure: true,
		path: "/",
		maxAge: 7 * 24 * 60 * 60, // 7 days
	});

	return res;
}
