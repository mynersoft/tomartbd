"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { addToCart } from "../../store/slices/cartSlice";

export default function WishlistPage() {
	const dispatch = useDispatch();
	const wishlist = useSelector((state) => state.wishlist.items);

	const handleRemove = (productId) => {
		dispatch(removeFromWishlist(productId));
		toast.success("Removed from wishlist!");
	};

	const handleAddToCart = (product) => {
		dispatch(addToCart({ product, quantity: 1 }));
		toast.success("Added to cart!");
	};

	if (wishlist.length === 0) {
		return (
			<div className="max-w-7xl mx-auto p-4 text-center">
				<h2 className="text-2xl font-semibold mb-4">
					Your Wishlist is Empty
				</h2>
				<Link
					href="/shop"
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-4">
			<h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{wishlist.map((product) => (
					<div
						key={product._id}
						className="bg-white shadow rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
						{/* Image */}
						<div className="h-48 w-full bg-gray-100 flex items-center justify-center p-2">
							{product.images?.[0] ? (
								<img
									src={product.images[0]}
									alt={product.name}
									className="object-contain h-full w-full"
								/>
							) : (
								<span className="text-gray-400">No Image</span>
							)}
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
											(product.price *
												(100 - product.discount)) /
											100
									  ).toFixed(2)
									: product.price}{" "}
								৳
							</p>

							{/* Actions */}
							<div className="mt-auto flex gap-2">
								<button
									onClick={() => handleAddToCart(product)}
									className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
									Add to Cart
								</button>
								<button
									onClick={() => handleRemove(product._id)}
									className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
									Remove
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
