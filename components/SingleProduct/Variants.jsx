import React from 'react';

const Variants = ({ productData }) => {
		const [selectedVariant, setSelectedVariant] = useState(null);
	
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-bold text-gray-900">Select Variant:</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{productData.variants.map((variant) => (
					<button
						key={variant.id}
						onClick={() => setSelectedVariant(variant)}
						className={`p-4 rounded-xl border-2 transition-all ${
							selectedVariant?.id === variant.id
								? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
								: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
						}`}>
						<div className="flex items-center justify-between mb-2">
							<span className="font-semibold text-gray-900">
								{variant.name}
							</span>
							<div
								className="w-6 h-6 rounded-full border"
								style={{
									backgroundColor: variant.color,
								}}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-green-600 font-semibold">
								৳
								{formatPrice(discountPrice + variant.id * 5000)}
							</span>
							<span
								className={`px-2 py-1 rounded text-xs ${
									variant.stock > 10
										? 'bg-green-100 text-green-700'
										: 'bg-orange-100 text-orange-700'
								}`}>
								{variant.stock} left
							</span>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default Variants;
