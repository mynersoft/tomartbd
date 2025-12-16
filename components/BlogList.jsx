import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogList({ posts }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                  {post.author.charAt(0)}
                </div>
                <span>{post.author}</span>
              </div>
              <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <Link 
              href={`/blog/${post.slug}`}
              className="mt-6 inline-block text-blue-600 font-semibold hover:text-blue-800"
            >
              Read more →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}