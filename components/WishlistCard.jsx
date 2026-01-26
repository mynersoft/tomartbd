import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';

export default function WishlistCard({ product }) {
  const dispatch = useDispatch();

 
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition">
      <div className="relative h-40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>

        <p className="text-primary font-bold mt-1">৳ {product.price}</p>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-primary text-white py-1 rounded-lg text-sm">
            Add to Cart
          </button>

          <button
            onClick={() => dispatch(removeFromWishlist(product._id))}
            className="px-3 border rounded-lg text-red-500"
            aria-label="Remove from wishlist"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
