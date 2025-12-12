import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

export async function GET() {
	await connectDB();

	const stream = new ReadableStream({
		async start(controller) {
			async function sendMessages() {
				const data = await Chat.find().sort({ createdAt: 1 }).limit(50);

				controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
			}

			await sendMessages();
			const interval = setInterval(sendMessages, 2000);

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
