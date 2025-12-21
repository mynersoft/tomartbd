"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "user") {
        router.replace("/dashboard/user");
      } else if (role === "seller") {
        router.replace("/dashboard/seller");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return null; // nothing to render (redirect only)
}