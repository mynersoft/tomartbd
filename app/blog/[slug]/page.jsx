"use client";

import { useSingleBlog } from "@/hooks/useBlog";

export default function SingleBlog({ params }) {
  const { data, isLoading } = useSingleBlog(params.slug);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Not found</p>;

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </article>
  );
}