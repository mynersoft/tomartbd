'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import ReviewForm from '@/components/ReviewForm';
import ProductQuestions from '@/components/ProductQuestions';
import { toast } from 'react-hot-toast';
import {
	Star,
	Truck,
	Shield,
	RefreshCw,
	Check,
	Share2,
	Heart,
	ShoppingCart,
	ChevronRight,
	Package,
	Award,
	Clock,
	Users,
	ChevronLeft,
	MessageSquare,
	BarChart,
	Tag,
} from 'lucide-react';
import Link from 'next/link';
import Variants from '../../../components/SingleProduct/Variants';

export default function ProductSinglePage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { slug } = useParams();
	const [showReviewForm, setShowReviewForm] = useState(false);

	const products = useSelector((state) => state.product.products);
	const wishlist = useSelector((state) => state.wishlist.items);
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState('description');
	const [imageLoaded, setImageLoaded] = useState(false);

	const product = products.find((item) => item.slug === slug);

	if (!product) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
				<div className="text-center space-y-6 max-w-md">
					<div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
						<Package className="w-20 h-20 text-gray-400" />
					</div>
					<h2 className="text-3xl font-bold text-gray-800">
						Product Not Found
					</h2>
					<p className="text-gray-600 text-lg">
						The product you're looking for doesn't exist or has been
						moved.
					</p>
					<button
						onClick={() => router.push('/')}
						className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
						Back to Home
					</button>
				</div>
			</div>
		);
	}

	const isWishlisted = wishlist.some((item) => item._id === product._id);
	const discountPrice = product.discount
		? (product.price * (100 - product.discount)) / 100
		: product.price;

	const formatPrice = (price) => {
		return new Intl.NumberFormat('en-BD', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				product,
				quantity,
				variant: selectedVariant,
			})
		);
		toast.success('🎉 Added to cart!');
	};

	const handleBuyNow = () => {
		handleAddToCart();
		router.push('/cart');
	};

	const handleWishlistToggle = () => {
		dispatch(toggleWishlist(product));
		toast.success(
			isWishlisted ? '❤️ Removed from wishlist' : '💝 Added to wishlist'
		);
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					text: `Check out ${product.name} on our store!`,
					url: window.location.href,
				});
			} catch (error) {
				console.log('Sharing cancelled');
			}
		} else {
			navigator.clipboard.writeText(window.location.href);
			toast.success('🔗 Link copied to clipboard!');
		}
	};

	const increaseQuantity = () => setQuantity((prev) => prev + 1);
	const decreaseQuantity = () =>
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	// Fallback data with images
	const productData = {
		...product,
		images: product.images || [
			'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w-800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1581092160607-ee22621f8a6a?w=800&auto=format&fit=crop',
		],
		variants: product.variants || [
			{ id: 1, name: '4GB+64GB', color: '#000000', stock: 15 },
			{ id: 2, name: '6GB+128GB', color: '#2563eb', stock: 8 },
			{ id: 3, name: '8GB+256GB', color: '#6b7280', stock: 3 },
		],
		specifications: product.specifications || [
			{ label: 'Brand', value: product.brand || 'Generic', icon: '🏷️' },
			{ label: 'Model', value: '2024 Edition', icon: '📱' },
			{ label: 'Warranty', value: '2 Years', icon: '🛡️' },
			{ label: 'In Stock', value: '45 Units', icon: '📦' },
		],
		highlights: [
			'4K Ultra HD Display',
			'120Hz Refresh Rate',
			'Fast Charging Support',
			'Water Resistant',
			'Dual Camera System',
		],
		ratings: product.ratings || {
			average: 4.5,
			total: 1247,
			breakdown: [450, 300, 200, 150, 147],
		},
		reviews: product.reviews || [
			{
				id: 1,
				user: 'Alex Johnson',
				rating: 5,
				date: '2024-01-15',
				comment:
					'Absolutely amazing product! The build quality exceeded my expectations. Delivery was super fast.',
				verified: true,
				avatar: '👨🏽‍💻',
			},
			{
				id: 2,
				user: 'Sarah Miller',
				rating: 4,
				date: '2024-01-10',
				comment:
					'Very satisfied with the purchase. Battery life is incredible. Minor improvement needed in packaging.',
				verified: true,
				avatar: '👩🏼‍🎓',
			},
		],
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
			{/* Enhanced Breadcrumb */}
			<div className="bg-white shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<nav className="flex items-center space-x-2 text-sm">
						<Link
							href="/"
							className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
							Home
						</Link>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<Link
							href="/categories"
							className="text-gray-600 hover:text-blue-600 transition-colors">
							Electronics
						</Link>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<Link
							href="/categories/smartphones"
							className="text-gray-600 hover:text-blue-600 transition-colors">
							Smartphones
						</Link>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<span className="text-gray-800 font-semibold truncate max-w-xs">
							{product.name}
						</span>
					</nav>
				</div>
			</div>

			{/* Main Product Section */}
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
						{/* Left Column - Images */}
						<div className="space-y-6">
							{/* Main Image Container */}
							<div className="relative border-2 border-gray-100 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white">
								<div className="aspect-square flex items-center justify-center p-8">
								
									<img
										src={productData.images[selectedImage]}
										alt={product.name}
										className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
										onLoad={() => setImageLoaded(true)}
									/>

									{/* Badges */}
									<div className="absolute top-4 left-4 flex flex-col gap-2">
										{product.discount && (
											<span className="bg-linear-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
												-{product.discount}% OFF
											</span>
										)}
										<span className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
											🔥 Best Seller
										</span>
									</div>

									{/* Navigation Arrows */}
									<button
										onClick={() =>
											setSelectedImage((prev) =>
												prev > 0
													? prev - 1
													: productData.images
															.length - 1
											)
										}
										className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all">
										<ChevronLeft className="w-5 h-5 text-gray-700" />
									</button>
									<button
										onClick={() =>
											setSelectedImage((prev) =>
												prev <
												productData.images.length - 1
													? prev + 1
													: 0
											)
										}
										className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all">
										<ChevronRight className="w-5 h-5 text-gray-700" />
									</button>
								</div>
							</div>

							{/* Thumbnails Gallery */}
							<div className="grid grid-cols-4 gap-3">
								{productData.images.map((img, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
											selectedImage === index
												? 'border-blue-500 ring-4 ring-blue-100 scale-105'
												: 'border-gray-200 hover:border-gray-300'
										}`}>
										<div className="aspect-square bg-gray-50 flex items-center justify-center">
											<img
												src={img}
												alt={`Thumbnail ${index + 1}`}
												className="w-full h-full object-contain p-2"
											/>
										</div>
										{selectedImage === index && (
											<div className="absolute inset-0 bg-blue-500/10"></div>
										)}
									</button>
								))}
							</div>

							{/* Quick Stats */}
							<div className="grid grid-cols-3 gap-4">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
									<Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
									<div className="text-2xl font-bold text-gray-800">
										1.2K+
									</div>
									<div className="text-sm text-gray-600">
										Sold Today
									</div>
								</div>
								<div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
									<Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
									<div className="text-2xl font-bold text-gray-800">
										4.8/5
									</div>
									<div className="text-sm text-gray-600">
										Rating
									</div>
								</div>
								<div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
									<Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
									<div className="text-2xl font-bold text-gray-800">
										24h
									</div>
									<div className="text-sm text-gray-600">
										Delivery
									</div>
								</div>
							</div>
						</div>

						{/* Right Column - Product Info */}
						<div className="space-y-8">
							{/* Product Header */}
							<div>
								<div className="flex items-start justify-between mb-4">
									<div>
										<div className="flex items-center gap-3 mb-3">
											<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
												{product.brand || 'Premium'}
											</span>
											<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
												In Stock
											</span>
										</div>
										<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
											{product.name}
										</h1>
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={handleWishlistToggle}
											className={`p-3 rounded-full transition-all ${
												isWishlisted
													? 'bg-red-50 text-red-500 hover:bg-red-100'
													: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
											}`}>
											<Heart
												className={`w-6 h-6 ${
													isWishlisted
														? 'fill-current'
														: ''
												}`}
											/>
										</button>
										<button
											onClick={handleShare}
											className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
											<Share2 className="w-6 h-6" />
										</button>
									</div>
								</div>

								{/* Rating & Sales */}
								<div className="flex items-center flex-wrap gap-6 mb-6">
									<div className="flex items-center gap-2">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-5 h-5 ${
														i <
														Math.floor(
															productData.ratings
																.average
														)
															? 'fill-yellow-400 text-yellow-400'
															: 'fill-gray-200 text-gray-200'
													}`}
												/>
											))}
										</div>
										<span className="text-lg font-bold text-gray-800">
											{productData.ratings.average.toFixed(
												1
											)}
										</span>
										<span className="text-gray-500">
											({productData.ratings.total}{' '}
											reviews)
										</span>
									</div>
								</div>
							</div>

							{/* Price Section */}
							<div className="bg-linear-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-100">
								<div className="space-y-4">
									<div className="flex items-baseline gap-4">
										<span className="text-4xl font-bold text-gray-900">
											৳{formatPrice(discountPrice)}
										</span>
										{product.discount && (
											<div className="flex items-center gap-3">
												<span className="text-2xl text-gray-400 line-through">
													৳
													{formatPrice(product.price)}
												</span>
												<span className="bg-linear-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full font-bold">
													Save {product.discount}%
												</span>
											</div>
										)}
									</div>

									<div className="space-y-3">
										<div className="flex items-center gap-2 text-green-600 font-semibold">
											<Check className="w-5 h-5" />
											<span>
												You save ৳
												{formatPrice(
													product.price -
														discountPrice
												)}
											</span>
										</div>
									</div>
								</div>
							</div>

							<Variants productData={productData} />

							{/* Quantity & Actions */}
							<div className="space-y-6">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
									<span className="font-semibold text-gray-700">
										Quantity:
									</span>
									<div className="flex items-center gap-4">
										<button
											onClick={decreaseQuantity}
											className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
											<span className="text-xl">-</span>
										</button>
										<span className="text-2xl font-bold w-12 text-center">
											{quantity}
										</span>
										<button
											onClick={increaseQuantity}
											className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
											<span className="text-xl">+</span>
										</button>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<button
										onClick={handleAddToCart}
										className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3">
										<ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
										<span>Add to Cart</span>
									</button>
									<button
										onClick={handleBuyNow}
										className="group bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:scale-[1.02]">
										Buy Now
									</button>
								</div>
							</div>

							{/* Delivery Info */}
							<div className="space-y-4">
								<h3 className="text-lg font-bold text-gray-900">
									Delivery & Services:
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-green-100 rounded-lg">
												<Truck className="w-6 h-6 text-green-600" />
											</div>
											<div>
												<p className="font-bold text-gray-900">
													Free Delivery
												</p>
												<p className="text-sm text-gray-600">
													Within 2-3 days
												</p>
											</div>
										</div>
									</div>
									<div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-blue-100 rounded-lg">
												<Shield className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<p className="font-bold text-gray-900">
													2 Year Warranty
												</p>
												<p className="text-sm text-gray-600">
													Full coverage
												</p>
											</div>
										</div>
									</div>
									<div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-purple-100 rounded-lg">
												<RefreshCw className="w-6 h-6 text-purple-600" />
											</div>
											<div>
												<p className="font-bold text-gray-900">
													14-Day Return
												</p>
												<p className="text-sm text-gray-600">
													Easy returns
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Tabs Section */}
					<div className="border-t border-gray-100">
						<div className="flex overflow-x-auto">
							{[
								'description',
								'questions',
								'specifications',
								'reviews',
							].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-8 py-4 font-semibold text-lg transition-all whitespace-nowrap ${
										activeTab === tab
											? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
											: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
									}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className="p-8">
							{activeTab === 'questions' && (
								<div className="space-y-6">
									<ProductQuestions
										productId={product._id}
										productName={product.name}
									/>
								</div>
							)}

							{activeTab === 'description' && (
								<div className="space-y-6">
									<h3 className="text-2xl font-bold text-gray-900">
										Product Description
									</h3>
									<p className="text-gray-700 leading-relaxed">
										{product.description ||
											'Experience cutting-edge technology with this premium device. Featuring advanced specifications and top-notch build quality, designed to exceed expectations.'}
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{productData.highlights.map(
											(highlight, index) => (
												<div
													key={index}
													className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
													<Check className="w-5 h-5 text-green-500" />
													<span>{highlight}</span>
												</div>
											)
										)}
									</div>
								</div>
							)}

							{activeTab === 'reviews' && (
								<div className="space-y-6">
									<ReviewForm
										isOpen={showReviewForm}
										onClose={() => setShowReviewForm(false)}
										productId={product._id}
										productName={product.name}
										orderId="12345" // Pass actual order ID if available
										customerName="John Doe" // Pass customer name if logged in
										onReviewSubmit={(review) => {
											// Handle the submitted review
											console.log('New review:', review);
											// You can update your reviews state here
										}}
									/>
								</div>
							)}

							{activeTab === 'specifications' && (
								<div className="space-y-6">
									<h3 className="text-2xl font-bold text-gray-900">
										Specifications
									</h3>

									<button
										onClick={() => setShowReviewForm(true)}
										className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
										<MessageSquare className="w-5 h-5" />
										Write a Review
									</button>
									<ReviewForm
										isOpen={showReviewForm}
										onClose={() => setShowReviewForm(false)}
										productId={product._id}
										productName={product.name}
										orderId="12345" // Pass actual order ID if available
										customerName="John Doe" // Pass customer name if logged in
										onReviewSubmit={(review) => {
											// Handle the submitted review
											console.log('New review:', review);
											// You can update your reviews state here
										}}
									/>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{productData.specifications.map(
											(spec, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
													<div className="flex items-center gap-3">
														<span className="text-2xl">
															{spec.icon}
														</span>
														<span className="font-semibold text-gray-700">
															{spec.label}
														</span>
													</div>
													<span className="font-bold text-gray-900">
														{spec.value}
													</span>
												</div>
											)
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
