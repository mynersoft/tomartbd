import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
	await connectDB();

	const stream = new ReadableStream({
		async start(controller) {
			async function sendOrders() {
				const orders = await Order.find()
					.sort({ createdAt: -1 })
					.limit(20)
					.populate("user");

				controller.enqueue(`data: ${JSON.stringify(orders)}\n\n`);
			}

			await sendOrders();

			const interval = setInterval(sendOrders, 3000);

			return () => clearInterval(interval);
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
