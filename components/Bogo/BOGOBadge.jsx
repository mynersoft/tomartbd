import React from 'react';
import { Gift } from 'lucide-react';

const BOGOBadge = ({ offer, className = '' }) => {
  if (!offer || offer.type !== 'BOGO') return null;

  const getBOGOText = () => {
    if (offer.sameProductOnly) {
      return `Buy ${offer.buyQty} Get ${offer.getQty} Free`;
    }
    return `Buy ${offer.buyQty} Get ${offer.getQty} Item Free`;
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold ${className}`}
    >
      <Gift className="w-3 h-3" />
      <span>{getBOGOText()}</span>
    </div>
  );
};

export default BOGOBadge;
