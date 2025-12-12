"use client";
import Link from "next/link";
import ProductTable from "../../../../components/Dashboard/ProductTable";
export default function AdminProductsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/dashboard/admin/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </Link>
      </div>
      <ProductTable />
    </div>
  );
}
