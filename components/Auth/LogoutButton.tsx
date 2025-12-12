"use client";

import { useLogout } from "@/hooks/useAuth";

export default function LogoutButton() {
	const logoutMutation = useLogout();

	return (
		<button
			onClick={() => logoutMutation.mutate()}
			className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
			Logout
		</button>
	);
}
