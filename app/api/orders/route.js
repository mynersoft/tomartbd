import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json(orders);
}



export async function POST(req) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	return NextResponse.json({ success: true });
}