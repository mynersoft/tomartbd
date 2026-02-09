import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlog } from "@/fetch/getBlog";
import BlogSinglePage from "./BlogSinglePage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

/* ---------------- SEO Metadata ---------------- */
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return {
    title: `${blog.metaTitle} | MahirProStore`,
    description: blog.metaDescription,
    keywords: blog.keywords,

    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: `https://mahirprostore.com/blog/${blog.slug}`,
      images: [
        {
          url: blog.featureImg,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle,
      description: blog.metaDescription,
      images: [blog.featureImg],
    },
  };
}

/* ---------------- Blog Page ---------------- */
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <BlogSinglePage blog={blog} />

      {/* -------- JSON-LD Structured Data -------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            image: blog.featureImg,
            description: blog.metaDescription,
            author: {
              "@type": "Person",
              name: blog.author || "MahirProStore",
            },
            publisher: {
              "@type": "Organization",
              name: "MahirProStore",
              logo: {
                "@type": "ImageObject",
                url: "https://mahirprostore.com/logo.png",
              },
            },
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://mahirprostore.com/blog/${blog.slug}`,
            },
          }),
        }}
      />
    </main>
  );
}