import { getBlogPost, getBlogPosts } from '@/lib/blog-data';
import Link from 'next/link';
import { format } from 'date-fns';

export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  
  return {
    title: `${post.title} | Next.js Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getBlogPost(params.slug);
  const posts = await getBlogPosts();
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 font-semibold hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm">Senior Developer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">Published</p>
              <p className="text-sm">{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-gray-800 text-white p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-2">Key Takeaways</h3>
            <p>{post.excerpt}</p>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link 
                key={relatedPost.id} 
                href={`/blog/${relatedPost.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                  <div className="flex gap-2">
                    {relatedPost.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Twitter
            </button>
            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
              LinkedIn
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black">
              Copy Link
            </button>
          </div>
        </div>
      </article>

      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">© {new Date().getFullYear()} Next.js Blog</p>
          <p className="text-gray-400">Read more interesting articles on our blog</p>
        </div>
      </footer>
    </div>
  );
}