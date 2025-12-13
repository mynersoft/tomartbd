"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success("Added to cart");
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Your Wishlist is Empty
        </h2>
        <Link
          href="/shop"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Price
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {wishlist.map((product) => {
              const finalPrice = product.discount
                ? (
                    (product.price * (100 - product.discount)) /
                    100
                  ).toFixed(2)
                : product.price;

              return (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Product Info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="object-contain h-full w-full"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium line-clamp-2">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-sm text-gray-500">
                            {product.brand}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 font-semibold text-blue-600">
                    ৳ {finalPrice}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}