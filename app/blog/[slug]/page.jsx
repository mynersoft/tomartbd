import Image from "next/image";

/* Fetch single blog */
async function getBlog(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Blog not found");
  }

  return res.json();
}

/* SEO Metadata */
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    },
  };
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.slug);

  return (
    <article className="max-w-5xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {blog.title}
      </h1>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-6">
        {new Date(blog.createdAt).toDateString()}
      </p>

      {/* Image */}
      <div className="relative w-full h-[350px] mb-8 rounded-xl overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}