"use client";
import { useSelector } from "react-redux";
import BlogList from "./BlogList";
import Link from "next/link";

export default function BlogPage() {
	const { posts } = useSelector((state) => state.blog);

	return (
		<main className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 py-12">
				<Link
					href="/dashboard/admin/blog/add"
					className="px-4 py-2 bg-primary text-primary-200 rounded">
					Add post
				</Link>
				<div className="mt-10 ">
          <BlogList posts={posts} />
        </div>
			</section>
		</main>
	);
}
