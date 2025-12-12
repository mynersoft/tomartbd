import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
	await connectDB();

	const body = await req.json();

	const msg = await Chat.create({
		userId: body.userId,
		sender: body.sender,
		message: body.message,
	});

	return NextResponse.json({ success: true, msg });
}
