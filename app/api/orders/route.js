import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

<<<<<<< HEAD
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
=======
/* ================= GET (Admin) ================= */
export async function GET() {
	
	await connectDB();
	const orders = await Order.find().sort({ createdAt: -1 });
	return NextResponse.json(orders);
}



export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();

		if (!body.address || !body.phone) {
			return NextResponse.json(
				{ message: "Missing fields" },
				{ status: 400 }
			);
		}

		await connectDB();

		const order = await Order.create({
			customer: {
				name: session.user.name,
				email: session.user.email,
				phone: body.phone,
			},
			total: body.totalAmount,
			payment: {
				method: "cash_on_delivery",
			},
			shipping: {
				address: body.address,
				city: body.city,
				phone: body.phone,
			},
			orderItems: body.products,
			userId: session.user.id, // ✅ now exists
		});

		return NextResponse.json({ success: true, order });
	} catch (error) {
		console.error("ORDER ERROR:", error);
		return NextResponse.json(
			{ message: "Server error" },
			{ status: 500 }
		);
	}
}
>>>>>>> 503647f00ae3ee40dc3cd99582a31f32071fde72
