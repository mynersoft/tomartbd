"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import AdminLayout from "../../components/Dashboard/AdminLayout";
import UserLayout from "../../components/Dashboard/UserLayout";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = pathname.startsWith("/dashboard/admin");
  const isUser = pathname.startsWith("/dashboard/user");
  const isSeller = pathname.startsWith("/dashboard/seller");

  useEffect(() => {
    // Not logged in
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      const role = session?.user?.role;

      if (isAdmin && role !== "admin") {
        router.replace("/unauthorized");
      }

      if (isUser && role !== "user") {
        router.replace("/unauthorized");
      }

      if (isSeller && role !== "seller") {
        router.replace("/unauthorized");
      }
    }
  }, [status, pathname, session, router]);

  // Loading state
  if (status === "loading") {
    return <div className="p-6">Checking access...</div>;
  }

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