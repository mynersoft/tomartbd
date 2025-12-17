"use client";

import { useSingleBlog } from "@/hooks/useSingleBlog";

export default function BlogViewPage({ params }) {
  const { data: blog, isLoading } = useSingleBlog(params.slug);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 text-gray-500">
        Blog not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Category + Featured */}
      <div className="flex gap-3 mb-4">
        {blog.category && (
          <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            {blog.category}
          </span>
        )}
        {blog.isFeatured && (
          <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {blog.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
        <span>
          📅 {new Date(blog.createdAt).toLocaleDateString()}
        </span>
        {blog.readTime && <span>⏱ {blog.readTime} min read</span>}
        {blog.views !== undefined && <span>👁 {blog.views} views</span>}
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-[320px] object-cover rounded-xl mb-8"
        />
      )}

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        {blog.content}
      </article>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}