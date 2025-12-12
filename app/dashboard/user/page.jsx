// app/user/page.tsx
"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Card from "@/components/ui/Card";
import { FiShoppingBag, FiHeart, FiUser, FiMapPin } from "react-icons/fi";
import { useState } from "react";

type Order = {
  _id: string;
  invoice: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function UserDashboard() {
  const queryClient = useQueryClient();

  // User Info
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  // User Orders
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/my");
      return res.data.orders;
    },
  });

  if (!me?.success) return <div className="p-6">Loading...</div>;

  const user = me.user;
  const [loadingOrders, setLoadingOrders] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    try {
      setLoadingOrders(orderId);
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled!");
        queryClient.invalidateQueries({ queryKey: ["my-orders"] }); // Refresh orders
      }
    } catch (err) {
      alert("Failed to cancel order");
    } finally {
      setLoadingOrders(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 👋</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <FiShoppingBag className="text-blue-600 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <FiHeart className="text-red-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Wishlist</p>
              <p className="text-2xl font-bold">View</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <FiUser className="text-green-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Account</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <FiMapPin className="text-orange-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-sm font-medium">Not set</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link
          href="/user/orders"
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-medium"
        >
          My Orders
        </Link>

        <Link
          href="/wishlist"
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl text-center font-medium"
        >
          My Wishlist
        </Link>

        <Link
          href="/cart"
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl text-center font-medium"
        >
          My Cart
        </Link>

        <Link
          href="/user/profile"
          className="bg-gray-800 hover:bg-black text-white p-4 rounded-xl text-center font-medium"
        >
          Edit Profile
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.invoice}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">৳ {order.total}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      {/* Cancel Order */}
                      {order.status !== "Cancelled" &&
                        !["Shipped", "Delivered"].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={loadingOrders === order._id}
                            className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}

                      {/* Download Invoice */}
                      <button
                        onClick={() =>
                          window.open(`/api/orders/${order._id}/invoice`, "_blank")
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}