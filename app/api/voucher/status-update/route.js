
import { NextResponse } from "next/server";
import Voucher from "@/models/Voucher";
import { connectDB } from "@/lib/db";
import {getIdFromReq} from "@/lib/getIdFromReq";

export async function PATCH(req, { params }) {
  try {
    const id = await getIdFromReq (req);

    await connectDB();

    const body = await req.json();

   

    const voucher = await Voucher.findByIdAndUpdate(
      id,
      { isActive:body.status },
      { new: true }
    );

    if (!voucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, voucher });
  } catch (error) {
    console.error("Voucher Status Update Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}