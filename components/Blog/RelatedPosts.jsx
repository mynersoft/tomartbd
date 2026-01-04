// components/blog/RelatedPosts.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  BookOpen,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function RelatedPosts({ posts = [], currentPostId }) {
  if (posts.length === 0) return null;

  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center shadow-sm">
            <BookOpen className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
            <p className="text-gray-600">Continue reading similar content</p>
          </div>
        </div>
        
        <Link
          href="/blog"
          className="px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`} className="block group">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge */}
                  {post.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded-full">
                      {post.category.name}
                    </span>
                  )}
                  
                  {/* Featured Badge */}
                  {post.isFeatured && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt || post.content?.substring(0, 100)}...
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime || 5} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-primary-600 font-medium">
                      Read More
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="px-5 pb-5">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${Math.min(100, (post.views || 0) / 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Popularity</span>
                    <span>{Math.min(100, (post.views || 0) / 100)}%</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5" />
          <div>
            <p className="font-medium text-primary-800">Based on your reading history</p>
            <p className="text-sm text-primary-600">These articles are trending among readers like you</p>
          </div>
        </div>
      </div>
    </div>
  );
}