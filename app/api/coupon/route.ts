import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

await connectDB();

export async function GET() {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, coupons });
}

export async function POST(req: Request) {
  const { code, discount, expiry, usageLimit } = await req.json();

  if (!code || !discount || !expiry) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const exists = await Coupon.findOne({ code });
  if (exists) {
    return NextResponse.json({ error: "Code exists" }, { status: 400 });
  }

  const coupon = await Coupon.create({ code, discount, expiry, usageLimit });
  return NextResponse.json({ success: true, coupon });
}

export async function PUT(req: Request) {
  const { id, code, discount, expiry, usageLimit } = await req.json();

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  coupon.code = code;
  coupon.discount = discount;
  coupon.expiry = expiry;
  coupon.usageLimit = usageLimit;

  await coupon.save();

  return NextResponse.json({ success: true, coupon });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await Coupon.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}