"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useChat() {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const es = new EventSource("/chat/stream");

		es.onmessage = (e) => {
			setMessages(JSON.parse(e.data));
		};

		return () => es.close();
	}, []);

	const sendMessage = async (
		message: string,
		sender: "admin" | "user",
		userId?: string
	) => {
		await api.post("/chat", { message, sender, userId });
	};

	return { messages, sendMessage };
}
