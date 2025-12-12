"use client";

import DarkModeToggle from "@/components/Common/DarkModeToggle";

export default function AdminTopbar({ user }: { user: any }) {
	return (
		<div className="bg-white dark:bg-gray-900 dark:text-white shadow p-4 flex justify-between items-center">
			<h1 className="font-bold text-lg">Admin Panel</h1>

			<div className="flex items-center gap-4">
				<DarkModeToggle />
				<span className="text-sm font-semibold">{user?.name}</span>
			</div>
		</div>
	);
}
