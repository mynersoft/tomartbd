import { NextResponse } from "next/server";
import Voucher from "@/models/Voucher";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/ApiError";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.code || !body.value)
      throw new ApiError("Required fields missing", 400);

    const voucher = await Voucher.create(body);

    return NextResponse.json({
      success: true,
      voucher,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    await connectDB();
    const vouchers = await Voucher.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      vouchers,
    });
  } catch (error) {
    return handleApiError(error);
  }
}