"use client";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationPanel() {
	const { notifications } = useNotifications();

	return (
		<div className="bg-white dark:bg-gray-900 p-4 rounded shadow mt-6">
			<h2 className="font-bold mb-2">🔔 Notifications</h2>

			{notifications.map((n: any) => (
				<div
					key={n._id}
					className="text-sm border-b py-2 last:border-none">
					<p className="font-semibold">{n.title}</p>
					<p className="text-gray-500">{n.message}</p>
				</div>
			))}
		</div>
	);
}
