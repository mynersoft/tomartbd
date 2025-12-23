"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const handleTrackOrder = () => {
    if (!orderId) return;

    // 🔹 Demo data (replace with API later)
    setOrder({
      id: orderId,
      status: "shipped", // pending | confirmed | shipped | delivered
      estimatedDelivery: "25 Dec 2025",
      items: [
        { name: "Wireless Headphone", qty: 1, price: 3500 },
        { name: "Smart Watch", qty: 1, price: 2200 },
      ],
      total: 5700,
    });
  };

  const steps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = order
    ? steps.findIndex(step => step.key === order.status)
    : -1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-600 mt-2">
          Enter your order ID to see delivery status
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD12345)"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004488]"
          />
          <button
            onClick={handleTrackOrder}
            className="flex items-center gap-2 bg-[#004488] text-white px-6 py-3 rounded-lg hover:bg-[#003366]"
          >
            <Search size={18} />
            Track
          </button>
        </div>
      </div>

      {/* Order Details */}
      {order && (
        <>
          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="font-bold text-lg mb-6">Order Status</h2>
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;

                return (
                  <div key={step.key} className="flex-1 text-center">
                    <div
                      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isActive
                          ? "bg-[#004488] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-[#004488]" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <span className="text-sm text-gray-500">
                Order ID: <b>{order.id}</b>
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>৳{item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#004488]">৳{order.total}</span>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              Estimated Delivery:{" "}
              <span className="font-medium">{order.estimatedDelivery}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}