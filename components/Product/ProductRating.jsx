import { Star } from 'lucide-react';

const ProductRating = ({ rating, reviewCount }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating || 0)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="text-gray-600">
      {rating?.toFixed(1) || '0.0'} • {reviewCount || 0} reviews
    </span>
  </div>
);

export default ProductRating;
