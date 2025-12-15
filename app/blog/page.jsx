import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/blog-data';

export const metadata = {
  title: 'Blog Home | Next.js Blog',
  description: 'Welcome to our blog featuring latest articles on technology, web development, and more.',
  keywords: 'blog, technology, web development, nextjs, react',
  openGraph: {
    title: 'Blog Home | Next.js Blog',
    description: 'Welcome to our blog featuring latest articles',
    type: 'website',
  },
};

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Blog</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover insightful articles about web development, technology trends, and best practices
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-blue-500 px-4 py-2 rounded-full">React</span>
            <span className="bg-purple-500 px-4 py-2 rounded-full">Next.js</span>
            <span className="bg-green-500 px-4 py-2 rounded-full">Tailwind</span>
            <span className="bg-red-500 px-4 py-2 rounded-full">Web Dev</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Articles</h2>
          <BlogList posts={posts} />
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Blog</h2>
          <p className="text-gray-600 mb-4">
            We're passionate about sharing knowledge and helping developers grow. Our blog covers
            a wide range of topics from beginner tutorials to advanced concepts.
          </p>
          <p className="text-gray-600">
            Join our community of developers and stay updated with the latest in web technology.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">© {new Date().getFullYear()} Next.js Blog. All rights reserved.</p>
          <p className="text-gray-400">Built with Next.js 14 & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}