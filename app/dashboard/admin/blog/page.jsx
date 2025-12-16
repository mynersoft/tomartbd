'use client';

import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BlogPostForm from './BlogPostForm';
import BlogPostList from './BlogPostList';

const queryClient = new QueryClient();

function AdminDashboard() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">All Blog Posts</h2>
              <BlogPostList posts={posts} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Add New Post</h2>
              <BlogPostForm />
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-blue-600">{posts.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2">Total Tags</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(posts.flatMap(post => post.tags)).size}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
            <p className="text-3xl font-bold text-purple-600">
              {posts.filter(post => {
                const postDate = new Date(post.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return postDate > weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-600">Posts this week</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboard />
    </QueryClientProvider>
  );
}