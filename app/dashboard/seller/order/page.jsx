"use client";

import { useEffect, useState } from "react";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Dummy data for frontend only
    const dummyOrders = [
      { id: "1", buyer: "John Doe", total: 120, status: "Pending" },
      { id: "2", buyer: "Alice", total: 250, status: "Shipped" },
      { id: "3", buyer: "Bob", total: 80, status: "Delivered" },
    ];
    setOrders(dummyOrders);
  }, []);

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Buyer</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.buyer}</td>
              <td className="p-2">${order.total}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2 space-x-2">
                {order.status !== "Delivered" && (
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => updateStatus(order.id, "Delivered")}
                  >
                    Mark Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}