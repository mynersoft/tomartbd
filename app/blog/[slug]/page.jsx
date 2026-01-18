"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { FiCalendar, FiEye, FiArrowLeft } from "react-icons/fi";
import { useBlogs } from "@/hooks/useBlog";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const { data, isLoading } = useBlogs();

  const [post, setPost] = useState(null);

  const siteUrl = "https://yourblog.com";

  /* ================= FIND BLOG BY SLUG ================= */
  useEffect(() => {
    if (!data?.length || !slug) return;

    const foundPost = data.find((b) => b.slug === slug);
    setPost(foundPost);
  }, [data, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  /* ================= SEO ================= */
  const metaTitle = post.seoTitle || post.title;
  const metaDescription =
    post.seoDescription ||
    post.excerpt ||
    post.content?.slice(0, 160);

  return (
    <>
      <Head>
        {/* BASIC SEO */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteUrl}/blog/${post.slug}`} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`${siteUrl}/blog/${post.slug}`} />
        <meta property="og:image" content={post.coverImage} />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={post.coverImage} />

        {/* ARTICLE SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: metaDescription,
              image: post.coverImage,
              datePublished: post.createdAt,
              author: {
                "@type": "Person",
                name: post.author || "Admin",
              },
            }),
          }}
        />
      </Head>

      {/* ================= UI ================= */}
      <article className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 mb-6"
          >
            <FiArrowLeft /> Back to Blog
          </Link>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <FiCalendar />{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <FiEye /> {post.views || 0} views
            </span>
          </div>

          <Image
            src={post.coverImage || "/default-blog.jpg"}
            alt={post.title}
            width={1200}
            height={630}
            priority
            className="rounded-2xl mb-8"
          />

          {/* BLOG CONTENT */}
          <div
            className="prose max-w-none prose-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </>
  );
}