const ColorSelector = ({ colors, selectedColor, onSelectColor }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className={`rounded-full w-8 h-8 border-2 transition-all flex items-center justify-center ${
            selectedColor === color
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
        </button>
      ))}
    </div>
  </div>
);


export default ColorSelector