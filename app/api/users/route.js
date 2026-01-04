import { connectDB } from "@/lib/db";
import User from '@/models/User'

export async function GET() {
	await connectDB();
	const products = await User.find().sort({ createdAt: -1 });
	return new Response(JSON.stringify(products), { status: 200 });
}
