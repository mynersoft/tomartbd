"use client";

import { useState, useEffect } from "react";
import { useBlogs } from "@/hooks/useBlog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";

// Icons (you can use react-icons or your own)
import { 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiTrendingUp, 
  FiBookmark, 
  FiBookOpen,
  FiCalendar,
  FiEye,
  FiShare2,
  FiChevronRight
} from "react-icons/fi";

export default function BlogHomePage() {
  const { data, isLoading } = useBlogs();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [viewportBlogs, setViewportBlogs] = useState([]);

  // Extract unique categories
  const categories = ["all", ...new Set(data?.map(blog => blog.category).filter(Boolean))];

  // Filter blogs based on search and category
  const filteredBlogs = data?.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Set featured post and trending posts on load
  useEffect(() => {
    if (data?.length > 0) {
      const featured = data.find(blog => blog.isFeatured) || data[0];
      setFeaturedPost(featured);
      
      // Simulate trending posts (views or popularity)
      const trending = [...data]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3);
      setTrendingPosts(trending);
      
      // Initial viewport blogs
      setViewportBlogs(data.slice(0, 6));
    }
  }, [data]);

  // SEO Meta Data
  const metaTitle = "Tech Insights & Tutorials | Your Blog Name";
  const metaDescription = "Discover the latest tutorials, tech insights, and programming guides. Stay updated with trending topics in web development and technology.";
  const siteUrl = "https://yourblog.com";
  const featuredImage = featuredPost?.coverImage || `${siteUrl}/og-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": metaTitle,
    "description": metaDescription,
    "url": siteUrl,
    "image": featuredImage,
    "publisher": {
      "@type": "Organization",
      "name": "Your Blog Name",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  };

  const handleLoadMore = () => {
    const currentLength = viewportBlogs.length;
    const nextBlogs = data.slice(currentLength, currentLength + 3);
    setViewportBlogs([...viewportBlogs, ...nextBlogs]);
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading inspiring stories...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="web development, programming, tutorials, technology, coding, react, nextjs" />
        <meta name="author" content="Your Name" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Your Blog Name" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={metaTitle} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={featuredImage} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional SEO */}
        <meta name="theme-color" content="#3b82f6" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
      </Head>

      {/* Schema Markup for Featured Post */}
      {featuredPost && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": featuredPost.title,
              "description": featuredPost.excerpt || featuredPost.content.slice(0, 200),
              "image": featuredPost.coverImage,
              "datePublished": featuredPost.createdAt,
              "dateModified": featuredPost.updatedAt || featuredPost.createdAt,
              "author": {
                "@type": "Person",
                "name": featuredPost.author || "Admin"
              }
            })
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Navigation & Search */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechInsights
              </Link>
              
              <div className="relative w-full md:w-auto flex-1 max-w-2xl">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles, tutorials, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    aria-label="Search blog posts"
                  />
                </div>
              </div>

              <nav className="flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                  Categories
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Category Filter */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-sm border-b py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto gap-4">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label={`Filter by ${category}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section with Featured Post */}
          {featuredPost && (
            <section className="mb-16" aria-labelledby="featured-post-title">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Featured
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FiCalendar /> {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <h1 id="featured-post-title" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-6">
                      {featuredPost.excerpt || featuredPost.content.slice(0, 200) + "..."}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      {featuredPost.tags?.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FiClock /> {featuredPost.readTime || 5} min read
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <FiEye /> {featuredPost.views || 0} views
                        </span>
                      </div>
                      
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                        aria-label={`Read full article: ${featuredPost.title}`}
                      >
                        Read Full Article
                        <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <img
                        src={featuredPost.coverImage || "/default-blog.jpg"}
                        alt={featuredPost.title}
                        className="relative w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending Posts Sidebar */}
            <aside className="lg:col-span-1" aria-label="Trending posts">
              <div className="sticky top-32 bg-white rounded-2xl p-6 shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiTrendingUp className="text-orange-500" />
                  Trending Now
                </h2>
                
                <div className="space-y-6">
                  {trendingPosts.map((post, index) => (
                    <article key={post._id} className="group">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
                            aria-label={`Trending article: ${post.title}`}
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiEye /> {post.views || 0}
                            </span>
                            <span>•</span>
                            <span>{post.category}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the latest articles delivered to your inbox</p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Subscribe to newsletter"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-md transition-shadow"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <section className="lg:col-span-2" aria-label="Blog posts">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Latest Articles
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredBlogs.length} articles)
                  </span>
                </h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select 
                    className="bg-transparent border-0 text-sm font-medium focus:outline-none"
                    aria-label="Sort articles"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try different keywords or categories</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {viewportBlogs.map((blog) => (
                      <article 
                        key={blog._id} 
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border"
                        itemScope
                        itemType="https://schema.org/Article"
                      >
                        <meta itemProp="datePublished" content={blog.createdAt} />
                        <meta itemProp="author" content={blog.author || "Admin"} />
                        
                        <Link href={`/blog/${blog.slug}`} className="block">
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={blog.coverImage || "/default-blog.jpg"}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              itemProp="image"
                              loading="lazy"
                            />
                            <div className="absolute top-4 left-4">
                              {blog.category && (
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 rounded-full">
                                  {blog.category}
                                </span>
                              )}
                            </div>
                            {blog.isFeatured && (
                              <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                  FEATURED
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6">
                            <h3 
                              className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2"
                              itemProp="headline"
                            >
                              {blog.title}
                            </h3>
                            
                            <p 
                              className="text-gray-600 mb-4 line-clamp-3"
                              itemProp="description"
                            >
                              {blog.excerpt || blog.content.slice(0, 150) + "..."}
                            </p>
                            
                            {blog.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.slice(0, 2).map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                    itemProp="keywords"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <FiClock /> {blog.readTime || 5} min
                                </span>
                                <time dateTime={blog.createdAt}>
                                  {new Date(blog.createdAt).toLocaleDateString()}
                                </time>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <button 
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                  aria-label="Save for later"
                                >
                                  <FiBookmark />
                                </button>
                                <button 
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                  aria-label="Share article"
                                >
                                  <FiShare2 />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {viewportBlogs.length < filteredBlogs.length && (
                    <div className="text-center mt-12">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                        aria-label="Load more articles"
                      >
                        Load More Articles
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Newsletter CTA */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white" aria-label="Newsletter subscription">
            <div className="max-w-2xl mx-auto text-center">
              <FiBookOpen className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
              <p className="text-blue-100 mb-6">
                Join 10,000+ developers receiving weekly insights and tutorials
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Email for newsletter subscription"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe Now
                </button>
              </form>
              <p className="text-sm text-blue-200 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">TechInsights</h3>
                <p className="text-gray-400">
                  Your source for latest technology insights, tutorials, and industry trends.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                  <li><Link href="/categories" className="text-gray-400 hover:text-white transition">Categories</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Categories</h4>
                <ul className="space-y-2">
                  {categories.slice(1, 5).map((category) => (
                    <li key={category}>
                      <button 
                        onClick={() => {
                          setSelectedCategory(category);
                          router.push('#');
                        }}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <p className="text-gray-400 mb-4">
                  Follow us for updates and community discussions
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">Twitter</a>
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="GitHub">GitHub</a>
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">LinkedIn</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} TechInsights. All rights reserved.</p>
              <div className="mt-4 text-sm">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <span className="mx-2">•</span>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
                <span className="mx-2">•</span>
                <Link href="/sitemap.xml" className="hover:text-white transition">Sitemap</Link>
                <span className="mx-2">•</span>
                <Link href="/rss.xml" className="hover:text-white transition">RSS Feed</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    </>
  );
}