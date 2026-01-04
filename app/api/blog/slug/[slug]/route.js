import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
	await connectDB();

	// ✅ params MUST be awaited
	const { slug } = await context.params;

	const blog = await Blog.findOne({ slug });

	if (!blog) {
		return NextResponse.json(
			{ message: 'Blog not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(blog);
}
