// components/blog/BlogSidebar.jsx
import { Search, TrendingUp, Calendar, Tag, Newspaper } from "lucide-react";
import Link from "next/link";

export default function BlogSidebar() {
	const categories = [
		{ name: "E-commerce Tips", count: 24, slug: "ecommerce-tips" },
		{ name: "Product Reviews", count: 18, slug: "product-reviews" },
		{ name: "Shopping Guides", count: 32, slug: "shopping-guides" },
		{ name: "Technology", count: 15, slug: "technology" },
		{ name: "Lifestyle", count: 21, slug: "lifestyle" },
	];

	const popularPosts = [
		{
			title: "10 Best Smartphones of 2024",
			views: "5.2K",
			slug: "best-smartphones-2024",
		},
		{
			title: "How to Save Money While Shopping Online",
			views: "4.8K",
			slug: "save-money-online-shopping",
		},
		{
			title: "Complete Guide to Electronics Maintenance",
			views: "3.9K",
			slug: "electronics-maintenance-guide",
		},
		{
			title: "Top 5 Laptops for Professionals",
			views: "3.5K",
			slug: "top-laptops-for-professionals",
		},
	];

	const tags = [
		"Smartphones",
		"Laptops",
		"Deals",
		"Reviews",
		"Technology",
		"Shopping",
		"Tips",
		"Guide",
		"Electronics",
		"Fashion",
	];

	return (
		<div className="space-y-8">
			{/* Search Box */}
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<Search className="h-5 w-5 text-primary-600" />
					Search Blog
				</h3>
				<div className="relative">
					<input
						type="search"
						placeholder="Search articles..."
						className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
					/>
					<Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
				</div>
			</div>

			{/* Categories */}
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<Tag className="h-5 w-5 text-primary-600" />
					Categories
				</h3>
				<ul className="space-y-2">
					{categories.map((category) => (
						<li key={category.slug}>
							<Link
								href={`/blog/category/${category.slug}`}
								className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
								<span className="text-gray-700 group-hover:text-primary-600">
									{category.name}
								</span>
								<span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
									{category.count}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>

			{/* Popular Posts */}
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-primary-600" />
					Popular Posts
				</h3>
				<div className="space-y-4">
					{popularPosts.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className="block group">
							<div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
								<div className="flex-1 min-w-0">
									<p className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
										{post.title}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<Eye className="h-3 w-3 text-gray-400" />
										<span className="text-xs text-gray-500">
											{post.views} views
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Tags Cloud */}
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<Newspaper className="h-5 w-5 text-primary-600" />
					Tags
				</h3>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Link
							key={tag}
							href={`/blog/tag/${tag
								.toLowerCase()
								.replace(/\s+/g, "-")}`}
							className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
							{tag}
						</Link>
					))}
				</div>
			</div>

			{/* Newsletter Subscription */}
			<div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6">
				<h3 className="font-bold text-white mb-3">Stay Updated</h3>
				<p className="text-primary-200 text-sm mb-4">
					Subscribe to our newsletter for the latest blog posts and
					updates.
				</p>
				<div className="space-y-3">
					<input
						type="email"
						placeholder="Your email address"
						className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
					/>
					<button className="w-full bg-white text-primary-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
						Subscribe Now
					</button>
				</div>
			</div>
		</div>
	);
}
