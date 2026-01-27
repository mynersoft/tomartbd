import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
import BlogSEO from '@/components/BlogSEO';
import BlogContent from '@/components/BlogContent';
import RelatedPosts from '@/components/RelatedPosts';

import AuthorBio from '@/components/AuthorBio';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    await connectDB();
    const post = await Blog.findBySlug(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }
    
    const seo = post.seo || {};
    
    return {
      title: seo.metaTitle || post.title,
      description: seo.metaDescription || post.excerpt,
      keywords: seo.keywords?.join(', '),
      authors: [{ name: post.author?.name }],
      openGraph: {
        title: seo.ogTitle || seo.metaTitle || post.title,
        description: seo.ogDescription || seo.metaDescription || post.excerpt,
        images: [seo.ogImage || post.coverImage],
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.lastModifiedAt || post.updatedAt,
        authors: [post.author?.name],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.twitterTitle || seo.metaTitle || post.title,
        description: seo.twitterDescription || seo.metaDescription || post.excerpt,
        images: [seo.twitterImage || seo.ogImage || post.coverImage],
      },
      alternates: {
        canonical: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
    };
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = params;
  
  try {
    await connectDB();
    
    const post = await Blog.findBySlug(slug)
      .populate('author.id', 'name email avatar bio socialLinks')
      .populate('relatedPosts', 'title slug excerpt coverImage');
    
    if (!post || post.status !== 'published') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">
              The blog post you are looking for does not exist or is not published.
            </p>
            <a href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Blog
            </a>
          </div>
        </div>
      );
    }
    
    // Fetch related posts if not populated
    let relatedPosts = post.relatedPosts;
    if (!relatedPosts || relatedPosts.length === 0) {
      relatedPosts = await Blog.findRelated(post._id);
    }
    
    return (
      <>
        <BlogSEO post={post} />
        
        <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
              <div className="mb-6">
                <a 
                  href={`/blog?category=${post.category}`}
                  className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                  {post.category}
                </a>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {post.author?.id?.avatar ? (
                      <img
                        src={post.author.id.avatar}
                        alt={post.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {post.author?.name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{post.author?.name}</p>
                    <p className="text-sm opacity-80">
                      {post.author?.id?.title || 'Writer'}
                    </p>
                  </div>
                </div>
                
                <div className="h-4 w-px bg-white/30 hidden md:block" />
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
         
            </div>
          </div>
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="container mx-auto px-4 md:px-6 max-w-4xl -mt-8 relative z-10">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <BlogContent content={post.content} />
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <a
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Author Bio */}
                <div className="mt-12">
                  <AuthorBio author={post.author} />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Table of Contents */}
                <div className="sticky top-24">
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">In this article</h3>
                    <nav className="space-y-2">
                      {/* You can generate TOC from content here */}
                      <a href="#" className="block text-gray-600 hover:text-blue-600">
                        Introduction
                      </a>
                      {/* Add more TOC items dynamically */}
                    </nav>
                  </div>
                  
                  {/* Share Buttons */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                    <ShareButtons 
                      title={post.title}
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
                      compact
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views</span>
                        <span className="font-semibold">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Word Count</span>
                        <span className="font-semibold">{post.wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reading Time</span>
                        <span className="font-semibold">{post.readTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-semibold">
                          {new Date(post.lastModifiedAt || post.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="bg-gray-50 py-16">
              <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Articles</h2>
                <p className="text-gray-600 mb-8">
                  You might also like these posts
                </p>
                <RelatedPosts posts={relatedPosts} />
              </div>
            </div>
          )}
        </article>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Post</h1>
          <p className="text-gray-600 mb-8">
            There was an error loading the blog post. Please try again later.
          </p>
          <a href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Blog
          </a>
        </div>
      </div>
    );
  }
}