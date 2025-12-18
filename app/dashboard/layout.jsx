"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "../../components/Dashboard/AdminLayout";
import UserLayout from "../../components/Dashboard/UserLayout";

export default function DashboardLayout({ children }) {
	const pathname = usePathname();

	const isAdmin = pathname.startsWith("/dashboard/admin");
	const isUser = pathname.startsWith("/dashboard/user");
	const isSeller = pathname.startsWith("/dashboard/seller");

	if (isAdmin) {
		return <AdminLayout>{children}</AdminLayout>;
	}

	if (isUser) {
		return <UserLayout>{children}</UserLayout>;
	}

	if (isSeller) {
		return <div>Seller Layout {children}</div>;
	}

	return <>{children}</>;
}
