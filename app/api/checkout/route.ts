import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { paymentMethod, address } = await req.json();

        if (!paymentMethod) {
            return NextResponse.json(
                { error: "Payment method required" },
                { status: 400 }
            );
        }

        const dbUser = await User.findById(user.id).populate("cart.product");

        if (!dbUser || dbUser.cart.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        const items = dbUser.cart.map((item: any) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name
        }));

        const total = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: dbUser._id,
            items,
            total,
            paymentMethod,
            address,
            status: "pending"
        });

        dbUser.cart = [];
        await dbUser.save();

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.log("Checkout error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}