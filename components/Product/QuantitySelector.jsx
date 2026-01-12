const QuantitySelector = ({ quantity, setQuantity }) => (
  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
    <button
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      className="px-4 py-3 hover:bg-gray-50 transition-colors"
      aria-label="Decrease quantity"
    >
      −
    </button>
    <span className="w-16 text-center font-medium text-lg">{quantity}</span>
    <button
      onClick={() => setQuantity(quantity + 1)}
      className="px-4 py-3 hover:bg-gray-50 transition-colors"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);


export default QuantitySelector;