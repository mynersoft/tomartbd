import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/* Fetch single blog */
async function getBlog(slug) {
	if (!slug) return null;

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`,
			{
				cache: 'no-store',
				next: { revalidate: 0 },
			}
		);

		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

/* SEO Metadata */
export async function generateMetadata({ params }) {
	const { slug } = await params;
	const blog = await getBlog(slug);

	if (!blog) {
		return {
			title: 'Blog Not Found | TomartBD',
			description: 'Requested blog not found',
		};
	}

	return {
		title: `${blog.title} | TomartBD`,
		description: blog.description,
		openGraph: {
			title: blog.title,
			description: blog.description,
			images: blog.image ? [blog.image] : [],
			type: 'article',
			publishedTime: blog.createdAt,
			authors: [blog.author?.name || 'TomartBD'],
		},
		twitter: {
			card: 'summary_large_image',
			title: blog.title,
			description: blog.description,
			images: [blog.image],
		},
	};
}

/* Calculate reading time */
function calculateReadingTime(content) {
	const wordsPerMinute = 200;
	const words = content?.split(/\s+/).length || 0;
	const minutes = Math.ceil(words / wordsPerMinute);
	return `${minutes} min read`;
}

/* Format date */
function formatDate(dateString) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

/* Blog Page Redesign */
export default async function BlogDetails({ params }) {
	const { slug } = await params;
	const blog = await getBlog(slug);

	if (!blog) {
		notFound();
	}

	const readingTime = calculateReadingTime(blog.content);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Back Navigation */}
			<div className="border-b border-gray-100">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<Link
						href="/blog"
						className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Blog
					</Link>
				</div>
			</div>

			{/* Hero Section */}
			<div className="relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50" />

				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Category */}
					{blog.category && (
						<span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-6">
							{blog.category}
						</span>
					)}

					{/* Title */}
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
						{blog.title}
					</h1>

					{/* Description */}
					{blog.description && (
						<p className="text-xl text-gray-600 mb-10 max-w-3xl">
							{blog.description}
						</p>
					)}

					{/* Meta Information */}
					<div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-10">
						<div className="flex items-center">
							<User className="w-4 h-4 mr-2" />
							<span>{blog.author?.name || 'TomartBD'}</span>
						</div>
						<div className="flex items-center">
							<CalendarDays className="w-4 h-4 mr-2" />
							<time dateTime={blog.createdAt}>
								{formatDate(blog.createdAt)}
							</time>
						</div>
						<div className="flex items-center">
							<Clock className="w-4 h-4 mr-2" />
							<span>{readingTime}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Featured Image */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
				<div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
					<Image
						src={blog.image || '/images/placeholder.jpg'}
						alt={blog.title}
						fill
						className="object-cover"
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
					/>

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

					{/* Image Caption */}
					{blog.imageCaption && (
						<div className="absolute bottom-4 left-4 right-4">
							<p className="text-sm text-white/90 italic">
								{blog.imageCaption}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
				{/* Article Content */}
				<article
					className="prose prose-lg max-w-none
          prose-headings:font-bold 
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
          prose-ul:text-gray-700 prose-ol:text-gray-700
          prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
          prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-img:rounded-xl prose-img:shadow-lg">
					{/* Render HTML content */}
					<div
						dangerouslySetInnerHTML={{ __html: blog.content || '' }}
					/>
				</article>

				{/* Tags */}
				{blog.tags?.length > 0 && (
					<div className="mt-16 pt-8 border-t border-gray-200">
						<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
							Tags
						</h3>
						<div className="flex flex-wrap gap-2">
							{blog.tags.map((tag) => (
								<span
									key={tag}
									className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
									{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Author Bio (Optional) */}
				{blog.author && (
					<div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
						<div className="flex items-start gap-4">
							{blog.author.avatar && (
								<div className="relative w-16 h-16 rounded-full overflow-hidden">
									<Image
										src={blog.author.avatar}
										alt={blog.author.name}
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div>
								<h4 className="font-semibold text-gray-900">
									{blog.author.name}
								</h4>
								{blog.author.bio && (
									<p className="mt-2 text-gray-600">
										{blog.author.bio}
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Share Section */}
				<div className="mt-16 pt-8 border-t border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Share this article
					</h3>
					<div className="flex gap-4">
						<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Twitter
						</button>
						<button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
							Facebook
						</button>
						<button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
							LinkedIn
						</button>
					</div>
				</div>
			</main>

			{/* Floating Table of Contents (for long articles) */}
			{blog.content && blog.content.length > 2000 && (
				<aside className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden xl:block w-64">
					<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
						<h4 className="font-semibold text-gray-900 mb-4">
							Table of Contents
						</h4>
						<nav className="space-y-2">
							{/* This would be generated dynamically based on h2/h3 tags */}
							<a
								href="#section1"
								className="block text-sm text-gray-600 hover:text-blue-600">
								Introduction
							</a>
							<a
								href="#section2"
								className="block text-sm text-gray-600 hover:text-blue-600">
								Main Content
							</a>
							<a
								href="#section3"
								className="block text-sm text-gray-600 hover:text-blue-600">
								Conclusion
							</a>
						</nav>
					</div>
				</aside>
			)}

			{/* Progress Bar */}
			<div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left transform scale-x-0 transition-transform duration-200 z-50" />
		</div>
	);
}
