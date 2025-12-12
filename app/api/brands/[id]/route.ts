import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

// UPDATE BRAND
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const data = await req.json();

  const brand = await Brand.findByIdAndUpdate(
    id,
    {
      ...data,
      slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    },
    { new: true }
  );

  return NextResponse.json({ success: true, brand });
}

// DELETE BRAND
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Brand.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}