import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { makeExcerpt, makeSEO } from "@/lib/blog-utils";

export async function GET(_: Request, { params }: any) {
  await connectDB();
  const blog = await Blog.findById(params.id);
  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const body = await req.json();

  const updated = await Blog.findByIdAndUpdate(
    params.id,
    {
      ...body,
      excerpt: makeExcerpt(body.content),
      seo: makeSEO(body.title, body.content),
      publishedAt:
        body.status === "published" ? new Date() : undefined,
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: any) {
  await connectDB();
  await Blog.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}