
"use client";

import Link from "next/link";

export default function SellerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/seller/add-product">
          <div className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer">
            Add Product
          </div>
        </Link>
        <Link href="/seller/products">
          <div className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer">
            My Products
          </div>
        </Link>
        <Link href="/seller/orders">
          <div className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer">
            My Orders
          </div>
        </Link>
      </div>
    </div>
  );
}