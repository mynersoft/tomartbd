// app/blog/[slug]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Eye,
  Heart,
  BookOpen,
  TrendingUp,
  Printer,
  Copy,
  Check,
  Loader2,
  Sparkles
} from "lucide-react";
import { useSingleBlog } from "@/hooks/useBlog";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// Dynamically import heavy components
const BlogSidebar = dynamic(() => import("@/components/blog/BlogSidebar"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const ShareButtons = dynamic(() => import("@/components/blog/ShareButtons"), {
  loading: () => <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
});

const TableOfContents = dynamic(() => import("@/components/blog/TableOfContents"), {
  loading: () => <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
});

const BlogComments = dynamic(() => import("@/components/blog/BlogComments"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const RelatedPosts = dynamic(() => import("@/components/blog/RelatedPosts"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const ReadingProgress = dynamic(() => import("@/components/blog/ReadingProgress"), {
  ssr: false
});

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/slug/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return {
        title: "Blog Post Not Found | TomartBD",
        description: "The requested blog post could not be found.",
      };
    }
    
    const post = await response.json();
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tomartbd.com";
    const description = post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || '';
    
    return {
      title: `${post.title} | TomartBD Blog - Premium E-commerce Insights`,
      description,
      keywords: post.tags?.join(", ") || "e-commerce, shopping, online store, products",
      authors: [{ name: post.author?.name || "TomartBD Team" }],
      publisher: "TomartBD",
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author?.name || "TomartBD Team"],
        tags: post.tags || [],
        images: [
          {
            url: post.featuredImage?.url || `${baseUrl}/images/blog/default-og.jpg`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [post.featuredImage?.url || `${baseUrl}/images/blog/default-og.jpg`],
        creator: "@tomartbd",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: `${baseUrl}/blog/${slug}`,
      },
      other: {
        "article:published_time": post.createdAt,
        "article:modified_time": post.updatedAt,
        "article:section": post.category?.name || "E-commerce",
      },
    };
  } catch (error) {
    return {
      title: "Blog | TomartBD",
      description: "Premium e-commerce insights and shopping guides",
    };
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) return [];
    
    const posts = await response.json();
    return posts.slice(0, 50).map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useSingleBlog(slug);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  
  // Get related posts from Redux store
  const allPosts = useSelector((state) => state.blog.posts || []);
  const relatedPosts = allPosts
    ?.filter(p => p.id !== post?.id && p.category?.id === post?.category?.id)
    .slice(0, 3) || [];

  // Initialize states
  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked || false);
      setLikesCount(post.likesCount || 0);
      setIsBookmarked(post.isBookmarked || false);
      
      // Calculate reading time
      if (post.content) {
        const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const time = Math.max(1, Math.ceil(words / 200));
        setReadingTime(time);
      }
    }
  }, [post]);

  // Scroll to top on new post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Handle like action
  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // API call to update like
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: !isLiked }),
      });
      
      if (!response.ok) {
        // Revert on error
        setIsLiked(isLiked);
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
        toast.error("Failed to update like");
      } else {
        toast.success(isLiked ? "Like removed" : "Post liked!");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // Handle bookmark action
  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      
      const response = await fetch(`/api/blog/${post.id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarked: !isBookmarked }),
      });
      
      if (!response.ok) {
        setIsBookmarked(isBookmarked);
        toast.error("Failed to update bookmark");
      } else {
        toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Print article
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="lg:w-2/3">
              <div className="space-y-6">
                {/* Skeleton for featured image */}
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                
                {/* Skeleton for content */}
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </main>
            <aside className="lg:w-1/3">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse All Posts
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
    image: post.featuredImage?.url || `${process.env.NEXT_PUBLIC_APP_URL}/images/blog/default-og.jpg`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "TomartBD Team",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/author/${post.author?.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "TomartBD",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`,
    },
    keywords: post.tags?.join(", "),
    articleSection: post.category?.name,
    wordCount: post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
    timeRequired: `PT${readingTime}M`,
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Floating Action Buttons */}
        <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="p-3 bg-white shadow-xl rounded-full border border-gray-200 hover:shadow-2xl transition-all group"
            title="Table of Contents"
          >
            <BookOpen className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
          </button>
          <button
            onClick={handleCopyUrl}
            className="p-3 bg-white shadow-xl rounded-full border border-gray-200 hover:shadow-2xl transition-all group"
            title="Copy URL"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
            )}
          </button>
          <button
            onClick={handlePrint}
            className="p-3 bg-white shadow-xl rounded-full border border-gray-200 hover:shadow-2xl transition-all group"
            title="Print"
          >
            <Printer className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1"
              >
                <span>Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                href="/blog"
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {post.category && (
                <>
                  <Link
                    href={`/blog/category/${post.category.slug}`}
                    className="text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {post.category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </>
              )}
              <span className="text-gray-600 truncate font-medium">{post.title}</span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Left Side */}
            <main className="lg:w-2/3">
              {/* Article Header */}
              <article className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
                {/* Featured Image */}
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                  <Image
                    src={post.featuredImage?.url || "/images/blog/default.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Category Badge & Premium Badge */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    {post.category && (
                      <Link
                        href={`/blog/category/${post.category.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors font-semibold text-sm shadow-lg"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    {post.isFeatured && (
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 md:p-8 lg:p-10">
                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.createdAt}>
                        {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                      </time>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <User className="h-4 w-4" />
                      <Link
                        href={`/author/${post.author?.slug}`}
                        className="hover:text-primary-600 transition-colors font-medium"
                      >
                        {post.author?.name || "TomartBD Team"}
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Eye className="h-4 w-4" />
                      <span>{post.views?.toLocaleString() || "0"} views</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    {post.title}
                  </h1>

                  {/* Article Excerpt */}
                  {post.excerpt && (
                    <div className="mb-8 p-5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <TrendingUp className="h-5 w-5 text-primary-600" />
                        </div>
                        <p className="text-lg text-primary-800 font-medium">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Table of Contents (Desktop) */}
                  {post.content && !showTableOfContents && (
                    <div className="mb-8">
                      <TableOfContents content={post.content} />
                    </div>
                  )}

                  {/* Article Body */}
                  {post.content && (
                    <div className="prose prose-lg max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-bold
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-li:text-gray-700 prose-li:leading-relaxed
                      prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
                      prose-blockquote:bg-primary-50 prose-blockquote:px-6 prose-blockquote:py-4
                      prose-blockquote:text-gray-600 prose-blockquote:italic prose-blockquote:rounded-r-lg
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
                      prose-table:border-collapse prose-table:w-full
                      prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left
                      prose-td:p-3 prose-td:border-t prose-td:border-gray-200
                      mb-10"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: post.content,
                        }}
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-8 p-5 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="h-5 w-5 text-primary-600" />
                        <h3 className="font-bold text-gray-900 text-lg">Related Topics</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Link
                            key={index}
                            href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                            className="px-4 py-2 bg-white border border-gray-200 hover:border-primary-300 
                              hover:bg-primary-50 text-gray-700 hover:text-primary-700 
                              rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Footer */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Share Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <Share2 className="h-5 w-5 text-primary-600" />
                          <span className="font-bold text-gray-900 text-lg">Share this post</span>
                        </div>
                        <ShareButtons 
                          title={post.title}
                          url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`}
                          excerpt={post.excerpt}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleLike}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
                            isLiked
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-600' : ''}`} />
                          <span>{likesCount}</span>
                        </button>
                        
                        <button
                          onClick={handleBookmark}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
                            isBookmarked
                              ? 'bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary-600' : ''}`} />
                          <span>Save</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-accent-50 text-accent-600 
                          hover:bg-accent-100 rounded-lg transition-colors font-medium"
                        >
                          <MessageSquare className="h-5 w-5" />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Table of Contents (Mobile - When triggered) */}
              {showTableOfContents && post.content && (
                <div className="lg:hidden mb-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">Table of Contents</h3>
                      <button
                        onClick={() => setShowTableOfContents(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 rotate-90" />
                      </button>
                    </div>
                    <TableOfContents content={post.content} />
                  </div>
                </div>
              )}

              {/* Author Card */}
              {post.author && (
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{post.author.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{post.author.bio || "Contributing writer"}</p>
                      <Link
                        href={`/author/${post.author.slug}`}
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm inline-flex items-center gap-1"
                      >
                        View all posts
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <BlogComments postId={post.id} />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <Link
                  href={post.previousPost ? `/blog/${post.previousPost.slug}` : "#"}
                  className={`flex items-center gap-3 p-5 rounded-xl border transition-all ${
                    post.previousPost
                      ? "border-gray-200 hover:border-primary-300 hover:bg-primary-50 group"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <div className="p-2 bg-gray-100 group-hover:bg-primary-100 rounded-lg">
                    <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Previous</span>
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {post.previousPost?.title || "No previous post"}
                    </p>
                  </div>
                </Link>

                <Link
                  href={post.nextPost ? `/blog/${post.nextPost.slug}` : "#"}
                  className={`flex items-center gap-3 p-5 rounded-xl border transition-all ${
                    post.nextPost
                      ? "border-gray-200 hover:border-primary-300 hover:bg-primary-50 group"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <div className="text-right flex-1">
                    <span className="text-sm text-gray-600">Next</span>
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {post.nextPost?.title || "No next post"}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-100 group-hover:bg-primary-100 rounded-lg">
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
                  </div>
                </Link>
              </div>
            </main>

            {/* Sidebar - Right Side */}
            <aside className="lg:w-1/3">
              <BlogSidebar />
            </aside>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated with the Latest Insights
              </h2>
              <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for weekly e-commerce tips, exclusive deals, and industry insights.
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}