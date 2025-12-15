import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json(orders);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const order = await Order.create(body);
  return Response.json(order, { status: 201 });
}