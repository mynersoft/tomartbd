import React from 'react';
import { Card, Button, Rate, Tooltip } from 'antd';

import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import BOGOBadge from './BOGOBadge';
// import { addToCart } from '@/store/cartSlice';
import { EyeIcon, ShoppingCart } from 'lucide-react';

const { Meta } = Card;

const BOGOProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();

//   const handleAddToCart = () => {
//     dispatch(
//       addToCart({
//         productId: product._id,
//         name: product.name,
//         price: product.salePrice,
//         offer: product.offer,
//         quantity: 1,
//       })
//     );

//     toast.success(`${product.name} added to cart!`);
//   };

  const handleViewDetails = () => {
    navigate(`/products/${product.slug || product._id}`);
  };

  const calculateSavings = () => {
    if (product.offer?.type === 'BOGO') {
      const buyQty = product.offer.buyQty || 1;
      const getQty = product.offer.getQty || 1;
      const unitPrice = product.salePrice;
      const effectivePrice = (buyQty * unitPrice) / (buyQty + getQty);
      return unitPrice - effectivePrice;
    }
    return 0;
  };

  const savings = calculateSavings();

  return (
    <Card
      hoverable
      className="bogo-product-card"
      cover={
        <div className="relative">
          <img
            alt={product.name}
            src={product.images?.[0] || '/default-product.jpg'}
            className="h-48 w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <BOGOBadge offer={product.offer} />
          </div>
          {savings > 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              Save ${savings.toFixed(2)}
            </div>
          )}
        </div>
      }
      actions={[
        <Tooltip title="View Details" key="view">
          <EyeIcon onClick={handleViewDetails} />
        </Tooltip>,
        <Tooltip title="Add to Cart" key="cart">
          <ShoppingCart onClick={handleAddToCart} />
        </Tooltip>,
      ]}
    >
      <Meta
        title={<span className="font-semibold">{product.name}</span>}
        description={
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">
                ${product.salePrice}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.regularPrice}
                </span>
              )}
            </div>

            {product.offer?.type === 'BOGO' && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                <p className="font-semibold">BOGO Offer Applied!</p>
                <p className="text-gray-600">
                  Add {product.offer.buyQty + product.offer.getQty} items to
                  cart, pay for only {product.offer.buyQty}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Rate
                disabled
                defaultValue={product.rating || 0}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">
                {product.sold || 0} sold
              </span>
            </div>

            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-xs text-orange-600">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default BOGOProductCard;
