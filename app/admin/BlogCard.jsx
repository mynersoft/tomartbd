import Link from 'next/link';

export default function BlogCard({ post }) {
  // Calculate reading time if not provided
  const readingTime = post.readTime || Math.ceil((post.content?.length || 0) / 1200) || 3;
  
  // Format date
  const date = post.publishedAt || post.createdAt;
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';
  
  // Default cover image
  const coverImage = post.coverImage || '/images/default-blog-cover.jpg';
  
  return (
    <article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200">
      {/* Cover Image */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/default-blog-cover.jpg';
          }}
        />
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {post.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-7">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm md:text-base mb-5 line-clamp-3">
          {post.excerpt || post.seo?.metaDescription}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-semibold">
                    {post.author?.name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
              <span className="font-medium text-gray-700">
                {post.author?.name || 'Anonymous'}
              </span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Date */}
          <div className="text-gray-500">
            {formattedDate}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium">{post.views || 0} views</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-sm font-medium">{post.likes || 0} likes</span>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group/link transition-colors"
          >
            <span>Read Full Article</span>
            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}