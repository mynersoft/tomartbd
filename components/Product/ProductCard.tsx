"use client";

import { IProduct } from "@/models/Product";

interface ProductCardProps {
	product: IProduct;
	onQuickView: () => void;
	onAddToCart: () => void;
	onToggleWishlist: () => void;
	isWishlisted: boolean;
}

export default function ProductCard({
	product,
	onQuickView,
	onAddToCart,
	onToggleWishlist,
	isWishlisted,
}: ProductCardProps) {
	const price =
		product.finalPrice ??
		product.price - (product.price * (product.discount || 0)) / 100;

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group">
			{/* Image */}
			<div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
				{product.images?.[0] ? (
					<img
						src={product.images[0]}
						alt={product.name}
						className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="text-gray-400 text-sm">
						No image available
					</div>
				)}
				{/* Discount badge */}
				{product.discount ? (
					<span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
						-{product.discount}%
					</span>
				) : null}
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col justify-between h-52">
				<h3 className="text-sm md:text-base font-medium line-clamp-2">
					{product.name}
				</h3>

				<div className="mt-2 flex items-baseline gap-2">
					<span className="text-lg font-bold text-gray-900">
						৳ {price}
					</span>
					{product.discount && (
						<span className="text-sm text-gray-400 line-through">
							৳ {product.price}
						</span>
					)}
				</div>

				{/* Buttons */}
				<div className="mt-3 flex gap-2">
					<button
						onClick={onQuickView}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition">
						Quick View
					</button>
					<button
						onClick={onAddToCart}
						className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition">
						Add to Cart
					</button>
				</div>

				{/* Footer */}
				<div className="mt-3 flex justify-between items-center text-xs md:text-sm text-gray-500">
					<span>{product.category}</span>
					<button
						onClick={onToggleWishlist}
						className={`transition-colors duration-300 ${
							isWishlisted ? "text-red-500" : "text-gray-400"
						} text-lg`}>
						{isWishlisted ? "♥" : "♡"}
					</button>
				</div>
			</div>
		</div>
	);
}
