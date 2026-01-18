// app/admin/blog/page.jsx
'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Tag,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

// Mock data - replace with actual API call
const mockPosts = [
  {
    _id: '1',
    title: 'Getting Started with React 18',
    slug: 'getting-started-with-react-18',
    author: 'John Doe',
    category: 'React',
    tags: ['React', 'JavaScript', 'Frontend'],
    status: 'published',
    views: 2450,
    comments: 42,
    createdAt: '2024-01-15',
    excerpt: 'Learn the new features and improvements in React 18...',
  },
  {
    _id: '2',
    title: 'Mastering Tailwind CSS',
    slug: 'mastering-tailwind-css',
    author: 'Jane Smith',
    category: 'CSS',
    tags: ['CSS', 'Tailwind', 'Design'],
    status: 'draft',
    views: 0,
    comments: 0,
    createdAt: '2024-01-18',
    excerpt: 'Advanced techniques and best practices for using Tailwind CSS...',
  },
  {
    _id: '3',
    title: 'Next.js 14 Best Practices',
    slug: 'nextjs-14-best-practices',
    author: 'Mike Johnson',
    category: 'Next.js',
    tags: ['Next.js', 'React', 'SSR'],
    status: 'published',
    views: 3210,
    comments: 56,
    createdAt: '2024-01-10',
    excerpt: 'Optimize your Next.js applications with these expert tips...',
  },
  {
    _id: '4',
    title: 'TypeScript for Beginners',
    slug: 'typescript-for-beginners',
    author: 'Sarah Williams',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript'],
    status: 'published',
    views: 1890,
    comments: 23,
    createdAt: '2024-01-05',
    excerpt: 'A comprehensive guide to getting started with TypeScript...',
  },
  {
    _id: '5',
    title: 'Building APIs with Node.js',
    slug: 'building-apis-with-nodejs',
    author: 'Robert Brown',
    category: 'Node.js',
    tags: ['Node.js', 'Backend', 'API'],
    status: 'scheduled',
    views: 0,
    comments: 0,
    createdAt: '2024-01-25',
    excerpt: 'Learn how to build robust REST APIs using Node.js and Express...',
  },
];

export default function BlogPage() {
	// const [posts, setPosts] = useState(mockPosts);
	const { posts } = useSelector( state => state.blog);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Get unique categories
  const categories = ['all', ...new Set(posts.map((post) => post.category))];
  const statuses = ['all', 'published', 'draft', 'scheduled'];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || post.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      published: {
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      draft: {
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: <Edit className="w-3 h-3" />,
      },
      scheduled: {
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: <Calendar className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status] || {
      color: 'bg-gray-100 text-gray-800 border border-gray-200',
      icon: null,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {status?.charAt(0)?.toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  // Handle delete
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id));
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  // Handle bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(currentPosts.map((post) => post._id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedPosts.length > 0) {
      setPosts((prev) =>
        prev.filter((post) => !selectedPosts.includes(post._id))
      );
      setSelectedPosts([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
          <p className="text-slate-600 mt-1">
            Manage and organize your blog posts
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/create"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>

          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-blue-700 font-medium">
              {selectedPosts.length} post(s) selected
            </span>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Delete Selected
            </button>
          </div>

          <button
            onClick={() => setSelectedPosts([])}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all'
                    ? 'All Status'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedPosts.length === currentPosts.length &&
                      currentPosts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Author
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Views
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post._id)}
                        onChange={() => handleSelectPost(post._id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-800">
                          {post.title}
                        </div>
                        <div className="text-sm text-slate-500 truncate max-w-xs">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{post.author}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span>{post.category}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={post.status} />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/edit/${post._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 px-4 text-center text-slate-500"
                  >
                    No blog posts found. Try adjusting your filters or create a
                    new post.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600">
            Showing {indexOfFirstPost + 1} to{' '}
            {Math.min(indexOfLastPost, filteredPosts.length)} of{' '}
            {filteredPosts.length} posts
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Delete Post
              </h3>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "
              <span className="font-semibold">{postToDelete.title}</span>"? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
