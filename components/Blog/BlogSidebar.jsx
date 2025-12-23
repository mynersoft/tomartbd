// components/blog/BlogSidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  TrendingUp, 
  Calendar, 
  Tag, 
  Newspaper,
  Clock,
  Eye,
  Star,
  Users,
  ArrowRight,
  Filter,
  Bookmark,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function BlogSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { name: "E-commerce Tips", count: 24, slug: "ecommerce-tips", color: "bg-blue-100 text-blue-700" },
    { name: "Product Reviews", count: 18, slug: "product-reviews", color: "bg-green-100 text-green-700" },
    { name: "Shopping Guides", count: 32, slug: "shopping-guides", color: "bg-purple-100 text-purple-700" },
    { name: "Technology", count: 15, slug: "technology", color: "bg-red-100 text-red-700" },
    { name: "Lifestyle", count: 21, slug: "lifestyle", color: "bg-yellow-100 text-yellow-700" },
    { name: "Business", count: 12, slug: "business", color: "bg-indigo-100 text-indigo-700" },
  ];

  const popularPosts = [
    { 
      title: "10 Best Smartphones of 2024", 
      views: "5.2K", 
      slug: "best-smartphones-2024",
      readTime: 8,
      category: "Technology",
      image: "/images/blog/smartphones.jpg"
    },
    { 
      title: "How to Save Money While Shopping Online", 
      views: "4.8K", 
      slug: "save-money-online-shopping",
      readTime: 6,
      category: "E-commerce Tips",
      image: "/images/blog/saving.jpg"
    },
    { 
      title: "Complete Guide to Electronics Maintenance", 
      views: "3.9K", 
      slug: "electronics-maintenance-guide",
      readTime: 12,
      category: "Shopping Guides",
      image: "/images/blog/electronics.jpg"
    },
    { 
      title: "Top 5 Laptops for Professionals", 
      views: "3.5K", 
      slug: "top-laptops-for-professionals",
      readTime: 7,
      category: "Technology",
      image: "/images/blog/laptops.jpg"
    },
  ];

  const tags = [
    "Smartphones", "Laptops", "Deals", "Reviews", "Technology", 
    "Shopping", "Tips", "Guide", "Electronics", "Fashion",
    "Home", "Kitchen", "Gadgets", "Accessories", "Trending"
  ];

  const filters = [
    { id: "all", label: "All", icon: <Newspaper className="h-4 w-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "featured", label: "Featured", icon: <Star className="h-4 w-4" /> },
    { id: "recent", label: "Recent", icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary-600" />
          Search Articles
        </h3>
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type keywords..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium">
            Search
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Press Enter to search</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary-600" />
            Filter
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.icon}
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary-600" />
            Categories
          </h3>
          <Link
            href="/blog/categories"
            className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${category.color}`}>
                  {category.name.split(" ")[0]}
                </span>
                <span className="text-gray-700 group-hover:text-primary-600 font-medium">
                  {category.name}
                </span>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Popular Posts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Popular Posts
          </h3>
          <div className="relative">
            <Zap className="h-5 w-5 text-accent-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
        </div>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2 leading-tight">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{post.readTime} min</span>
                    </div>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {post.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Tags Cloud */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary-600" />
            Popular Tags
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 text-gray-700 hover:text-primary-700 rounded-lg transition-all text-sm font-medium hover:shadow-sm"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Newsletter Subscription */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl mb-2">Stay Updated</h3>
          <p className="text-primary-200 text-sm mb-6">
            Get weekly e-commerce insights, exclusive deals, and industry news directly in your inbox.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button className="w-full bg-white text-primary-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
              Subscribe Now
            </button>
          </div>
          <p className="text-xs text-primary-300 mt-4 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </motion.div>

      {/* Community Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Blog Community</h3>
            <p className="text-accent-100 text-sm">Join our growing community</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-accent-100 text-xs">Readers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">1.2K</div>
            <div className="text-accent-100 text-xs">Articles</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-accent-100 text-xs">Satisfaction</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-accent-100 text-xs">Support</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}