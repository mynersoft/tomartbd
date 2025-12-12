"use client";
import { useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
	const { data, isLoading, isError } = useMe();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!data?.success || data?.user?.role !== "admin") {
				toast.error("Access denied. Admins only.");
				router.replace("/auth/login");
			}
		}
	}, [data, isLoading, router]);

	if (isLoading) {
		return <div className="p-6 text-center">Loading...</div>;
	}

	if (isError || !data?.success) {
		return null;
	}

	return <>{children}</>;
}
