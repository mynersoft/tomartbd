import { Truck } from 'lucide-react';

const FreeShippingInfo = () => {
  const shippingFee = 0;
  if (shippingFee === 0) {
    return (
      shippingFee === 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              🎉 Free shipping on orders over ৳2000!
            </p>
          </div>
        </div>
      )
    );
  }
  return null;
};

export default FreeShippingInfo;
