"use client";

import { IProduct } from "@/models/Product";
import { useCart } from "@/hooks/useCart";

export default function AddToCartButton({ product }: { product: IProduct }) {
	const { addToCart } = useCart();

	return (
		<button
			onClick={() => addToCart(String(product._id))}
			className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
			Add to Cart
		</button>
	);
}
