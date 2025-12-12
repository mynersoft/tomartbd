import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use _id if exists, otherwise fallback to id
        const orders = await Order.find({ user: user.id })
            .sort({ createdAt: -1 })
            .populate("items.product");

        return NextResponse.json({ orders });

    } catch (error) {
        console.error("Orders Fetch Error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}