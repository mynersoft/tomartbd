"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAdminAuth() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		// Not logged in
		if (!session) {
			router.push("/auth/login");
		}

		// Logged in but not admin
		if (session && session.user.role !== "admin") {
			router.push("/");
		}
	}, [session, status, router]);

	return { session, status };
}
