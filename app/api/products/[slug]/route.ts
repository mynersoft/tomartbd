import { NextRequest, NextResponse } from "next/server";
import type { IProduct } from '@/types/product';
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    // ✅ unwrap params Promise
    const { slug } = await params;

    const product:IProduct = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, product },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Product API error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}