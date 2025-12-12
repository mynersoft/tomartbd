import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET() {
  await connectDB();
  const brands = await Brand.find().sort({ createdAt: -1 });
  return NextResponse.json({ brands });
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const brand = await Brand.create({
    ...data,
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
  });

  return NextResponse.json({ success: true, brand });
}