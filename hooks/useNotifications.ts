"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const es = new EventSource("/api/admin/notifications/stream");

		es.onmessage = (e) => {
			setNotifications(JSON.parse(e.data));
		};

		return () => es.close();
	}, []);

	return { notifications };
}
