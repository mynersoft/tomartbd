// PATCH /api/voucher/:id/status
import { NextResponse } from "next/server";
import Voucher from "@/models/Voucher";
import { connectDB } from "@/lib/db";

export async function PATCH(req) {
const id = await getIdFromReq (req);
  await connectDB();
  
  const { isActive } = await req.json();

  const voucher = await Voucher.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  return NextResponse.json({ success: true, voucher });
}