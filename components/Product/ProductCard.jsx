"use client";

import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

export default function ProductCard({ product }) { 
	const dispatch = useDispatch();

	const handleQuickView = () => toast("Quick view coming soon!");

	const handleWishlist = () => {
		toast.success("Toggled wishlist!");
	};

	const handleAddToCart = () => {
		dispatch(addToCart({ product }));
		toast.success("Added to cart!");
	};

	return (
		<div className="bg-white shadow rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
			{/* Image */}
			<div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
				{product.images?.length > 0 ? (
					<img
						src={product.images[0]}
						alt={product.name}
						className="object-contain h-full w-full p-2"
					/>
				) : (
					<span className="text-gray-400">No Image</span>
				)}
				<button
					onClick={handleWishlist}
					className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100 transition">
					❤️
				</button>
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col flex-1">
				<h3 className="font-semibold text-lg line-clamp-2 mb-1">
					{product.name}
				</h3>
				{product.brand && (
					<p className="text-gray-500 text-sm mb-2">
						{product.brand}
					</p>
				)}
				<p className="font-bold text-blue-600 mb-2">
					{product.discount
						? (
								(product.price * (100 - product.discount)) /
								100
						  ).toFixed(2)
						: product.price}{" "}
					৳
				</p>

				<div className="mt-auto flex gap-2">
					<button
						onClick={handleQuickView}
						className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
						Quick View
					</button>
					<button
						onClick={handleAddToCart}
						className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}
