export const metadata = {
  title: 'Blog | Latest Articles',
  description: 'Read the latest articles, tutorials, and updates from our blog.',
};

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`, {
    cache: 'no-store', // always fresh
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  return res.json();
}

import BlogList from './BlogList';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Our Blog</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Insights, tutorials, and stories from our team
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}