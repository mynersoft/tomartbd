"use client";

import { useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserOnly({ children }) {
	const { data, isLoading } = useMe();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!data?.success || data.user.role !== "user") {
				router.push("/auth/login");
			}
		}
	}, [data, isLoading, router]);

	if (isLoading || !data?.success) return <p>Loading...</p>;

	return <>{children}</>;
}
