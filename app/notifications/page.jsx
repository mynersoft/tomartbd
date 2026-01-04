"use client";

import AdminNotifications from "@/components/Dashboard/AdminNotifications";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Notifications</h1>
      <div className="max-w-xl mx-auto">
        <AdminNotifications />
      </div>
    </div>
  );
}