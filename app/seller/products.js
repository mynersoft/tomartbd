import { useEffect, useState } from "react";
import Link from "next/link";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    setProducts(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Products</h1>
      <Link href="/seller/add-product">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Product
        </button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          products.map((p, i) => (
            <div key={i} className="border rounded shadow p-4">
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h2 className="font-bold">{p.name}</h2>
              <p>Price: ${p.price}</p>
              <p>Stock: {p.stock}</p>
              <p>Category: {p.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}