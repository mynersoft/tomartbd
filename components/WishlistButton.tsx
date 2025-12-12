"use client";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({ productId }: { productId: string }) {
	const { toggleWishlist, isWishlisted } = useWishlist();

	return (
		<button
			onClick={() => toggleWishlist(productId)}
			className="border px-6 py-3 rounded-lg font-medium">
			{isWishlisted(productId) ? "❤️ Wishlisted" : "🤍 Add Wishlist"}
		</button>
	);
}
