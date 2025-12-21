import { NextResponse } from "next/server";
import Voucher from "@/models/Voucher";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/ApiError";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";


import { checkAuthRole } from "@/lib/checkAuthRole";

  


export async function POST(req) {
  try {

const { isAdmin } = await checkAuthRole();


if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Forbidden: Admin only" },
      { status: 403 }
    );
  }




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