"use client";

import { useState, useEffect } from "react";
import { useBlogs } from "@/hooks/useBlog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";

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
  FiChevronRight,
} from "react-icons/fi";

export default function BlogHomePage() {
  const { data, isLoading } = useBlogs();
  console.log(data);
  
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [viewportBlogs, setViewportBlogs] = useState([]);

  const siteUrl = "https://yourblog.com";

  const categories = [
    "all",
    ...new Set(data?.map((b) => b.category).filter(Boolean)),
  ];

  const filteredBlogs =
    data?.filter((blog) => {
      const q = searchQuery.toLowerCase();
      return (
        (blog.title.toLowerCase().includes(q) ||
          blog.excerpt?.toLowerCase().includes(q) ||
          blog.tags?.some((t) => t.toLowerCase().includes(q))) &&
        (selectedCategory === "all" ||
          blog.category === selectedCategory)
      );
    }) || [];

  useEffect(() => {
    if (!data?.length) return;

    const featured = data.find((b) => b.isFeatured) || data[0];
    setFeaturedPost(featured);

    setTrendingPosts(
      [...data].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3)
    );

    setViewportBlogs(data.slice(0, 6));
  }, [data]);

  const handleLoadMore = () => {
    setViewportBlogs((prev) => [
      ...prev,
      ...filteredBlogs.slice(prev.length, prev.length + 3),
    ]);
  };

  const metaTitle = "Tech Insights & Tutorials | TechInsights";
  const metaDescription =
    "Latest programming tutorials, React, Next.js, and modern web development guides.";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head>
        {/* BASIC SEO */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="react, nextjs, web development, tutorials" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteUrl}/blog`} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`${siteUrl}/blog`} />
        <meta
          property="og:image"
          content={featuredPost?.coverImage || `${siteUrl}/og-image.jpg`}
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta
          name="twitter:image"
          content={featuredPost?.coverImage || `${siteUrl}/og-image.jpg`}
        />

        {/* BLOG SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "TechInsights Blog",
              url: `${siteUrl}/blog`,
            }),
          }}
        />
      </Head>

      {/* FEATURED ARTICLE SCHEMA */}
      {featuredPost && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: featuredPost.title,
              description:
                featuredPost.excerpt ||
                featuredPost.content?.slice(0, 160),
              image: featuredPost.coverImage,
              datePublished: featuredPost.createdAt,
              author: {
                "@type": "Person",
                name: featuredPost.author || "Admin",
              },
            }),
          }}
        />
      )}

      {/* PAGE UI (UNCHANGED) */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <header className="sticky top-0 bg-white/90 backdrop-blur border-b z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TechInsights
            </Link>

            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-full border"
              />
            </div>
          </div>
        </header>

        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-4">
              {featuredPost.title}
            </h1>

            <Image
              src={featuredPost.coverImage || "/default-blog.jpg"}
              alt={featuredPost.title}
              width={1200}
              height={630}
              priority
              className="rounded-2xl"
            />
          </section>
        )}

        <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {viewportBlogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition"
            >
              <Link href={`/blog/${blog.slug}`}>
                <Image
                  src={blog.coverImage || "/default-blog.jpg"}
                  alt={blog.title}
                  width={600}
                  height={350}
                  className="rounded-t-xl"
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </main>

        {viewportBlogs.length < filteredBlogs.length && (
          <div className="text-center pb-10">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-full"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}