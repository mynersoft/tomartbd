"use client";

import { Metadata } from "next";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Website analytics overview with users, orders and revenue",
};

const stats = [
  {
    title: "Total Users",
    value: "12,450",
    icon: Users,
    growth: "+8.2%",
  },
  {
    title: "Orders",
    value: "3,210",
    icon: ShoppingCart,
    growth: "+5.4%",
  },
  {
    title: "Revenue",
    value: "৳ 1,25,000",
    icon: DollarSign,
    growth: "+12.6%",
  },
  {
    title: "Conversion Rate",
    value: "3.4%",
    icon: TrendingUp,
    growth: "+1.1%",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 text-sm">
          Track your website performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl p-4 shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <item.icon className="w-6 h-6 text-blue-600" />
              <span className="text-green-600 text-sm">{item.growth}</span>
            </div>
            <h3 className="text-gray-500 text-sm mt-2">{item.title}</h3>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        <h2 className="font-semibold mb-4">Weekly Traffic</h2>
        <div className="flex items-end gap-3 h-40">
          {[40, 60, 30, 80, 55, 70, 90].map((height, i) => (
            <div key={i} className="flex-1">
              <div
                className="bg-blue-600 rounded-lg"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">#ORD{i}245</td>
                  <td>User {i}</td>
                  <td>
                    <span className="text-green-600">Completed</span>
                  </td>
                  <td>৳ 2,500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}