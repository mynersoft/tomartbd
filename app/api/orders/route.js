import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";

export default async function handler(req, res) {
	await connectDB();

	try {
		const user = await getUserFromToken(req);
		if (!user) return res.status(401).json({ message: "Unauthorized" });

		if (req.method === "GET") {
			const orders = await Order.find({ user: user._id }).sort({
				createdAt: -1,
			});
			return res.status(200).json(orders);
		}

		res.status(405).json({ message: "Method not allowed" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}
