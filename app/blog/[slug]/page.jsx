// app/blog/[slug]/page.jsx

import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import BlogPostClient from "./BlogPostClient";

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      return {
        title: "Blog Post Not Found | TomartBD",
        description: "The requested blog post could not be found.",
      };
    }
    
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

// Generate static paths
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.slice(0, 50).map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Server Component that fetches data
export default async function BlogPostPage({ params }) {
  const { slug } = params;
  
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      notFound();
    }

    // Get related posts (simulate from API or database)
    const allPosts = await getAllBlogPosts();
    const relatedPosts = allPosts
      ?.filter(p => p.id !== post?.id && p.category?.id === post?.category?.id)
      .slice(0, 3) || [];

    return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
  } catch (error) {
    notFound();
  }
}