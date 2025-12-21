"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/Dashboard/AdminLayout";
import UserLayout from "../../components/Dashboard/UserLayout";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const hasLoggedOut = useRef(false);

  // 🔐 ROLE PATH CHECK (covers /dashboard/admin/*)
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isUserRoute = pathname.startsWith("/dashboard/user");
  const isSellerRoute = pathname.startsWith("/dashboard/seller");

  const forceLogout = async (message) => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    toast.error(message);

    await signOut({ redirect: false });
    router.replace("/auth/login");
  };

  useEffect(() => {
    // ❌ Not authenticated
    if (status === "unauthenticated") {
      forceLogout("Please login to continue");
      return;
    }

    // ❌ Wrong role
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (isAdminRoute && role !== "admin") {
        forceLogout("Admin access only");
      }

      if (isUserRoute && role !== "user") {
        forceLogout("User access only");
      }

      if (isSellerRoute && role !== "seller") {
        forceLogout("Seller access only");
      }
    }
  }, [status, pathname, session]);

  // ⏳ Loading
  if (status === "loading") {
    return <div className="p-6">Checking access...</div>;
  }

  // 🎨 Layout Switch
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isUserRoute) {
    return <UserLayout>{children}</UserLayout>;
  }

  if (isSellerRoute) {
    return <div>Seller Layout {children}</div>;
  }

  return <>{children}</>;
}