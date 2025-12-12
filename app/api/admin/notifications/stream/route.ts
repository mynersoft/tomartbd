import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET() {
	await connectDB();

	const stream = new ReadableStream({
		async start(controller) {
			async function send() {
				const data = await Notification.find()
					.sort({ createdAt: -1 })
					.limit(10);

				controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
			}

			await send();
			const interval = setInterval(send, 3000);

			return () => clearInterval(interval);
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			Connection: "keep-alive",
			"Cache-Control": "no-cache",
		},
	});
}
