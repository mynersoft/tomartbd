"use client";

import { useBlogs } from "@/hooks/useBlog";

export default function BlogPage() {
  const { data, isLoading } = useBlogs();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Blog List</h1>
      {data.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.content.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}