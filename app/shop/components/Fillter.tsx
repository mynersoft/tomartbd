import React from "react";

const Fillter = () => {
	return (
		<div className="lg:col-span-1 bg-white border rounded-lg p-4 h-fit sticky top-24">
			<div className="flex items-center gap-2 mb-4 font-semibold text-lg">
				<FiFilter /> Filters
			</div>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Category
					</label>
					<select
						className="w-full border px-3 py-2 rounded"
						value={category}
						onChange={(e) => {
							setCategory(e.target.value);
							setPage(1);
						}}>
						<option value="all">All</option>
						<option value="electronics">Electronics</option>
						<option value="mobile">Mobile</option>
						<option value="fashion">Fashion</option>
						<option value="hardware">Hardware</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Sort By
					</label>
					<select
						className="w-full border px-3 py-2 rounded"
						value={sort}
						onChange={(e) => {
							setSort(e.target.value);
							setPage(1);
						}}>
						<option value="newest">Newest</option>
						<option value="low">Price: Low → High</option>
						<option value="high">Price: High → Low</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Price Range
					</label>
					<div className="flex gap-2">
						<input
							type="number"
							placeholder="Min"
							value={minPrice}
							onChange={(e) =>
								setMinPrice(
									e.target.value === ""
										? ""
										: Number(e.target.value)
								)
							}
							className="border px-2 py-2 rounded w-1/2"
						/>
						<input
							type="number"
							placeholder="Max"
							value={maxPrice}
							onChange={(e) =>
								setMaxPrice(
									e.target.value === ""
										? ""
										: Number(e.target.value)
								)
							}
							className="border px-2 py-2 rounded w-1/2"
						/>
					</div>
				</div>

				<label className="inline-flex items-center gap-2">
					<input
						type="checkbox"
						checked={stockOnly}
						onChange={(e) => {
							setStockOnly(e.target.checked);
							setPage(1);
						}}
					/>
					<span className="text-sm">In stock only</span>
				</label>

				<button
					onClick={() => {
						setSearch("");
						setCategory("all");
						setSort("newest");
						setMinPrice("");
						setMaxPrice("");
						setStockOnly(false);
						setPage(1);
					}}
					className="text-sm text-blue-600 underline">
					Reset Filters
				</button>
			</div>
		</div>
	);
};

export default Fillter;
