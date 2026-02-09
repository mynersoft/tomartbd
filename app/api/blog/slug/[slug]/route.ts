import { NextResponse } from "next/server";
import {connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

type Params = {
  params: {
    slug: string;
  };
};

/* ---------------- GET Single Blog ---------------- */
export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const blog = await Blog.findOne({ slug: params.slug })
      .select(
        `
        title
        slug
        content
        featureImg
        metaTitle
        metaDescription
        keywords
        author
        createdAt
        updatedAt
        `
      )
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Single blog fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}