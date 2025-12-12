"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = (role) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;
		if (!session) router.push("/auth/login");
		if (role && session?.user.role !== role) router.push("/");
	}, [session, status, router]);

	return { session, status };
};


// Use in any page:
// "use client";
// import { useAuth } from "@/hooks/useAuth";

// export default function AdminDashboard() {
// 	useAuth("admin");
// 	return <div>Admin Only Content</div>;
// }