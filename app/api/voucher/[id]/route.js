import { NextResponse } from "next/server";
import Voucher from "@/models/Voucher";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/ApiError";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const voucher = await Voucher.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!voucher) throw new ApiError("Voucher not found", 404);

    return NextResponse.json({ success: true, voucher });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Voucher.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Voucher deleted",
    });
  } catch (error) {
    return handleApiError(error);
  }
}