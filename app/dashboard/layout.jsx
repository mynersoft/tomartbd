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

  // prevent multiple logout calls
  const hasLoggedOut = useRef(false);

  const isAdmin = pathname.startsWith("/dashboard/admin");
  const isUser = pathname.startsWith("/dashboard/user");
  const isSeller = pathname.startsWith("/dashboard/seller");

  useEffect(() => {
    const forceLogout = async (message) => {
      if (hasLoggedOut.current) return;
      hasLoggedOut.current = true;

      toast.error(message);

      await signOut({
        redirect: false, // IMPORTANT
      });

      router.replace("/auth/login");
    };

    // ❌ Not logged in
    if (status === "unauthenticated") {
      forceLogout("Please login to continue");
      return;
    }

    // ❌ Logged in but wrong role
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (isAdmin && role !== "admin") {
        forceLogout("Unauthorized access");
      }

      if (isUser && role !== "user") {
        forceLogout("Unauthorized access");
      }

      if (isSeller && role !== "seller") {
        forceLogout("Unauthorized access");
      }
    }
  }, [status, pathname, session, router]);

  // ⏳ Loading state
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