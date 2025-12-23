import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import BlogPostClient from "./BlogPostClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://tomartbd.com";

/* ----------------------------------------
   Metadata
----------------------------------------- */
export async function generateMetadata({ params }) {
  const slug = params?.slug;

  if (!slug) {
    return {
      title: "Blog | TomartBD",
    };
  }

  try {
    const post = await getBlogPost(slug);
    if (!post) {
      return {
        title: "Blog Post Not Found | TomartBD",
        description: "The requested blog post could not be found.",
      };
    }

    const description =
      post.excerpt ||
      post.content?.replace(/<[^>]+>/g, "").slice(0, 160) ||
      "Premium e-commerce insights and shopping guides";

    const image =
      post.featuredImage?.url ||
      `${BASE_URL}/images/blog/default-og.jpg`;

    return {
      title: `${post.title} | TomartBD Blog`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${BASE_URL}/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: "Blog | TomartBD",
    };
  }
}

/* ----------------------------------------
   Static Paths
----------------------------------------- */
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

/* ----------------------------------------
   Blog Single Page
----------------------------------------- */
export default async function BlogPostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  try {
    const post = await getBlogPost(slug);
    if (!post) notFound();

    const allPosts = await getAllBlogPosts();

    const relatedPosts =
      allPosts
        ?.filter(
          (p) =>
            p.slug !== slug &&
            p.category?.id === post.category?.id
        )
        .slice(0, 3) || [];

    return (
      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
      />
    );
  } catch {
    notFound();
  }
}