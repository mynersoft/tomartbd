import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    // 1️⃣ Auth check
    const session = await getServerSession(authOptions);
    console.log(session , "=======================================================================================");
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse body
    const body = await req.json();
    const { items, totalAmount, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Order items required" },
        { status: 400 }
      );
    }

    // 3️⃣ DB connect
    await connectDB();

    // 4️⃣ Create order
    const order = await Order.create({
      user: session.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    // 5️⃣ Success
    return NextResponse.json(
      { message: "Order created", order },
      { status: 201 }
    );

  } catch (error) {
    console.error("ORDER POST ERROR 👉", error);

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
