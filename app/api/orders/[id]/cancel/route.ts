import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findOne({ _id: id, user: user.id });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (["Shipped", "Delivered"].includes(order.status)) {
    return NextResponse.json(
      { error: "Cannot cancel this order" },
      { status: 400 }
    );
  }

  order.status = "Cancelled";
  await order.save();

  return NextResponse.json({ success: true, order });
}