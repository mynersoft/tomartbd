"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export default function AdminChatPage() {
	const { messages, sendMessage } = useChat();
	const [text, setText] = useState("");

	return (
		<div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
			<h1 className="text-xl font-bold mb-4">💬 Live Support</h1>

			<div className="h-80 overflow-y-auto border p-3 mb-4">
				{messages.map((m: any) => (
					<div
						key={m._id}
						className={`mb-2 ${
							m.sender === "admin"
								? "text-right text-blue-600"
								: "text-left text-green-600"
						}`}>
						<m.div>{m.message}</m.div>
					</div>
				))}
			</div>

			<div className="flex gap-2">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="flex-1 border px-3 py-2 rounded"
					placeholder="Type message..."
				/>
				<button
					onClick={() => {
						sendMessage(text, "admin");
						setText("");
					}}
					className="bg-blue-600 text-white px-4 rounded">
					Send
				</button>
			</div>
		</div>
	);
}
