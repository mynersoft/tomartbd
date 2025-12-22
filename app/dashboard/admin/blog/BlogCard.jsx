import Link from 'next/link';

export default function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {post.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          {/* ✅ FIXED AUTHOR ISSUE */}
          <span>
            By {post.author?.name || 'Unknown author'}
          </span>

          <span>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}