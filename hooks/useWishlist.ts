import { useEffect, useState } from "react";
import axios from "axios";

export function useWishlist(userId?: string) {
	const [wishlist, setWishlist] = useState<string[]>([]);

	// Load wishlist: MongoDB for logged-in users, localStorage for guests
	useEffect(() => {
		if (userId) {
			axios
				.get("/api/wishlist")
				.then((res) =>
					setWishlist(res.data.wishlist.map((p: any) => p._id))
				);
		} else {
			const local = localStorage.getItem("wishlist");
			if (local) setWishlist(JSON.parse(local));
		}
	}, [userId]);

	// Add/remove wishlist item
	const toggleWishlist = async (productId: string) => {
		if (userId) {
			const res = await axios.post("/api/wishlist", { productId });
			setWishlist(res.data.wishlist);
		} else {
			let updated = [...wishlist];
			if (updated.includes(productId))
				updated = updated.filter((id) => id !== productId);
			else updated.push(productId);
			setWishlist(updated);
			localStorage.setItem("wishlist", JSON.stringify(updated));
		}
	};

	// Sync localStorage wishlist to MongoDB when user logs in
	const syncWishlistToDB = async () => {
		if (!userId) return;
		const local = localStorage.getItem("wishlist");
		if (!local) return;

		const localWishlist = JSON.parse(local);
		for (const pid of localWishlist) {
			if (!wishlist.includes(pid)) {
				await axios.post("/api/wishlist", { productId: pid });
			}
		}
		localStorage.removeItem("wishlist");
	};

	return { wishlist, toggleWishlist, syncWishlistToDB };
}
