import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/auth";
import { IUser } from "@/types/models/User";



export async function GET(req: NextRequest) {
	await connectDB();

	const user: IUser | null = await getUserFromToken(req);
	if (!user) {
		return NextResponse.json({ success: false }, { status: 401 });
	}

	const dbUser = await User.findById(user.id).select("-password");

	if (!dbUser) {
		return NextResponse.json({ success: false }, { status: 404 });
	}

	return NextResponse.json({
		success: true,
		user: {
			id: dbUser._id.toString(),
			name: dbUser.name,
			email: dbUser.email,
			role: dbUser.role,
		},
	});
}
