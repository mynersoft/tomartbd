"use client";

import { useEffect, useState } from "react";

export function useRealtimeOrders() {
	const [orders, setOrders] = useState<any[]>([]);

	useEffect(() => {
		const eventSource = new EventSource("/api/admin/orders/stream");

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setOrders(data);
		};

		return () => {
			eventSource.close();
		};
	}, []);

	return { orders };
}
