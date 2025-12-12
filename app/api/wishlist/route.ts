// pages/api/wishlist.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectDB();
	const user = await getUserFromToken(req);

	if (!user) return res.status(401).json({ error: "Unauthorized" });

	const dbUser = await User.findById(user.id).populate("wishlist");
	if (!dbUser) return res.status(404).json({ error: "User not found" });

	if (req.method === "GET") {
		// Fetch wishlist
		return res.status(200).json({ wishlist: dbUser.wishlist || [] });
	}

	if (req.method === "POST") {
		// Add or remove from wishlist
		const { productId } = req.body;
		if (!productId)
			return res.status(400).json({ error: "Product ID is required" });

		const exists = dbUser.wishlist.includes(productId);
		if (exists) {
			dbUser.wishlist = dbUser.wishlist.filter(
				(id) => id.toString() !== productId
			);
		} else {
			dbUser.wishlist.push(productId);
		}

		await dbUser.save();
		return res.status(200).json({ wishlist: dbUser.wishlist });
	}

	// Method not allowed
	return res.status(405).json({ error: "Method not allowed" });
}
