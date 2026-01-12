const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelectSize(size)}
          className={`px-4 py-2 rounded-lg border font-medium transition-all ${
            selectedSize === size
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400 text-gray-700'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

export default SizeSelector;
