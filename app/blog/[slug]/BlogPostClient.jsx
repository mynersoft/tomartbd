"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

/* ---------------- Dynamic Imports ---------------- */

const BlogSidebar = dynamic(() => import("@/components/Blog/BlogSidebar"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const ShareButtons = dynamic(() => import("@/components/Blog/ShareButtons"), {
  loading: () => <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
});

const TableOfContents = dynamic(
  () => import("@/components/Blog/TableOfContents"),
  { loading: () => <div className="h-32 bg-gray-100 rounded-xl animate-pulse" /> }
);

const BlogComments = dynamic(() => import("@/components/Blog/BlogComments"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const RelatedPosts = dynamic(() => import("@/components/Blog/RelatedPosts"), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
});

const ReadingProgress = dynamic(
  () => import("@/components/Blog/ReadingProgress"),
  { ssr: false }
);

/* ---------------- Component ---------------- */

export default function BlogPostClient({ post, relatedPosts = [] }) {
  const { slug } = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (!post) return;

    setIsLiked(post.isLiked || false);
    setLikesCount(post.likesCount || 0);
    setIsBookmarked(post.isBookmarked || false);

    if (post.content) {
      const words = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
    }
  }, [post]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  /* ---------------- Handlers ---------------- */

  const handleLike = async () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(v => (next ? v + 1 : v - 1));

    const res = await fetch(`/api/blog/${post.id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked: next })
    });

    if (!res.ok) {
      setIsLiked(!next);
      setLikesCount(v => (next ? v - 1 : v + 1));
      toast.error("Failed to update like");
    }
  };

  const handleBookmark = async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);

    const res = await fetch(`/api/blog/${post.id}/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookmarked: next })
    });

    if (!res.ok) {
      setIsBookmarked(!next);
      toast.error("Failed to update bookmark");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  /* ---------------- Render ---------------- */

  if (!post) return null;

  return (
    <>
      <ReadingProgress />

      {/* Floating Buttons */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
        <button onClick={() => setShowTableOfContents(v => !v)} className="fab">
          <BookOpen className="h-5 w-5" />
        </button>
        <button onClick={handleCopyUrl} className="fab">
          {copied ? <Check /> : <Copy />}
        </button>
        <button onClick={handlePrint} className="fab">
          <Printer />
        </button>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <article className="lg:w-2/3 bg-white rounded-3xl shadow-xl">

          {/* Title */}
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            {/* CONTENT — FIXED HERE */}
            <div
              className={`
                prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-li:text-gray-700
                prose-a:text-primary-600 prose-a:font-medium
                hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500
                prose-blockquote:bg-primary-50 prose-blockquote:px-6 prose-blockquote:py-4
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                prose-img:rounded-xl prose-img:shadow-lg
                mb-10
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleLike} className="btn">
                <Heart className={isLiked ? "fill-red-500" : ""} />
                {likesCount}
              </button>

              <button onClick={handleBookmark} className="btn">
                <Bookmark className={isBookmarked ? "fill-primary-500" : ""} />
                Save
              </button>
            </div>
          </div>
        </article>

        <aside className="lg:w-1/3">
          <BlogSidebar />
        </aside>
      </main>
    </>
  );
}