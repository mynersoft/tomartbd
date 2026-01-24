import Head from 'next/head';

export default function BlogSEO({ post, siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' }) {
  const seo = post?.seo || {};
  const canonicalUrl = seo.canonicalUrl || `${siteUrl}/blog/${post?.slug}`;
  
  const metaTitle = seo.metaTitle || post?.title || 'Blog Post';
  const metaDescription = seo.metaDescription || post?.excerpt || '';
  const ogImage = seo.ogImage || post?.coverImage || `${siteUrl}/images/default-og-image.jpg`;
  const twitterImage = seo.twitterImage || ogImage;
  
  // Structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title,
    "description": metaDescription,
    "image": [ogImage],
    "datePublished": post?.publishedAt,
    "dateModified": post?.lastModifiedAt || post?.updatedAt,
    "author": [{
      "@type": "Person",
      "name": post?.author?.name,
      "url": post?.author?.id ? `${siteUrl}/author/${post.author.id}` : undefined
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Your Blog Name", // Replace with your blog name
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "wordCount": post?.wordCount || 0,
    "timeRequired": `PT${post?.readTime || 5}M`,
    "keywords": seo.keywords?.join(', ') || '',
    "articleSection": post?.category || 'General'
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={seo.keywords?.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seo.ogTitle || metaTitle} />
      <meta property="og:description" content={seo.ogDescription || metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Your Blog Name" />
      <meta property="article:published_time" content={post?.publishedAt} />
      <meta property="article:modified_time" content={post?.lastModifiedAt || post?.updatedAt} />
      <meta property="article:author" content={post?.author?.name} />
      <meta property="article:section" content={post?.category} />
      {post?.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={seo.twitterTitle || metaTitle} />
      <meta property="twitter:description" content={seo.twitterDescription || metaDescription} />
      <meta property="twitter:image" content={twitterImage} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={post?.author?.name} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* iOS */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Head>
  );
}