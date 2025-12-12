"use client";

import { IProduct } from "@/models/Product";

interface QuickViewModalProps {
	product: IProduct;
	onClose: () => void;
	onAddToCart: (id: string) => void;
	onToggleWishlist: (id: string) => void;
	isWishlisted: boolean;
}

export default function QuickViewModal({
	product,
	onClose,
	onAddToCart,
	onToggleWishlist,
	isWishlisted,
}: QuickViewModalProps) {
	const price =
		product.finalPrice ??
		product.price - (product.price * (product.discount || 0)) / 100;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
			<div className="bg-white rounded-xl max-w-lg w-full shadow-lg overflow-hidden relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold transition">
					✖
				</button>

				{/* Image */}
				<div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
					{product.images?.[0] ? (
						<img
							src={product.images[0]}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
						/>
					) : (
						<div className="text-gray-400">No Image</div>
					)}
					{product.discount ? (
						<span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
							-{product.discount}%
						</span>
					) : null}
				</div>

				{/* Content */}
				<div className="p-4 flex flex-col gap-3">
					<h2 className="text-lg md:text-xl font-bold line-clamp-2">
						{product.name}
					</h2>
					<p className="text-gray-600 max-h-24 overflow-y-auto text-sm md:text-base">
						{product.description}
					</p>

					{/* Price */}
					<div className="flex items-baseline gap-2">
						<span className="text-xl font-bold text-gray-900">
							৳ {price}
						</span>
						{product.discount && (
							<span className="text-sm text-gray-400 line-through">
								৳ {product.price}
							</span>
						)}
					</div>

					{/* Buttons */}
					<div className="flex gap-3 mt-2">
						<button
							onClick={() => onAddToCart(String(product._id))}
							className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
							Add to Cart
						</button>
						<button
							onClick={() =>
								onToggleWishlist(String(product._id))
							}
							className={`px-4 py-2 border rounded transition ${
								isWishlisted
									? "text-red-500 border-red-500"
									: "text-gray-500 border-gray-300 hover:text-red-500 hover:border-red-500"
							}`}>
							{isWishlisted ? "♥" : "♡"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
