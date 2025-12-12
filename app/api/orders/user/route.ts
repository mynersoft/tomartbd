// app/api/orders/user/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).populate("items.product");
  return NextResponse.json({ success: true, orders });
}