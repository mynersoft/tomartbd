"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/Dashboard/AdminLayout";
import UserLayout from "@/components/Dashboard/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const hasLoggedOut = useRef(false);

    // 🔐 Route detection
    const isAdminRoute = pathname.startsWith("/admin");
    const isUserRoute = pathname.startsWith("/user");
    const isSellerRoute = pathname.startsWith("/seller");

    const forceLogout = async message => {
        if (hasLoggedOut.current) return;
        hasLoggedOut.current = true;

        toast.error(message);
        await signOut({ redirect: false });
        router.replace("/auth/login");
    };

    useEffect(() => {
        // Not authenticated
        if (status === "unauthenticated") {
            forceLogout("Please login to continue");
            return;
        }

        // Wrong role access
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
    }, [status, pathname, session, router]);

    // Loading state
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Layout selection
    if (isAdminRoute) {
        return <AdminLayout>{children}</AdminLayout>;
    }
    if (isUserRoute) {
        return <UserLayout>{children}</UserLayout>;
    }
    if (isSellerRoute) {
        return (
            <div className="min-h-screen bg-gray-50">
                Seller Layout {children}
            </div>
        );
    }

    return <div className="min-h-screen bg-gray-50">{children}</div>;
}
