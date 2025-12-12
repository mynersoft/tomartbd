import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(req, { params }) {
	try {
		await connectDB();
		const { id } = params;
		const { role } = await req.json();

		const user = await User.findByIdAndUpdate(id, { role }, { new: true });

		if (!user) throw new Error("User not found");

		return new Response(JSON.stringify({ success: true, user }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, error: err.message }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
}
