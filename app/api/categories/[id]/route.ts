import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

// UPDATE CATEGORY
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const data = await req.json();

  const updated = await Category.findByIdAndUpdate(
    id,
    {
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, "-"),
      parent: data.parent || null,
      level: data.level,
    },
    { new: true }
  );

  return NextResponse.json({ success: true, category: updated });
}

// DELETE CATEGORY
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Category.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}