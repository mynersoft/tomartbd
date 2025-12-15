import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req, { params }) {
  await connectDB();
  const { status } = await req.json();

  const order = await Order.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );

  return Response.json(order);
}