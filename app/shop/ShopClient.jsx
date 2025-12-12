"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Pagination from "./components/Pagination";
import { FiSearch, FiFilter } from "react-icons/fi";
import ProductCard from "@/components/Product/ProductCard";
import QuickViewModal from "@/components/Product/QuickViewModal";

// Fetch products from API
async function fetchProducts(params) {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") {
			searchParams.set(k, String(v));
		}
	});

	const res = await api.get(`/products?${searchParams.toString()}`);
	return res.data;
}

export default function ShopClient() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");
	const [sort, setSort] = useState("newest");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [stockOnly, setStockOnly] = useState(false);
	const [page, setPage] = useState(1);
	const [limit] = useState(12);
	const [quickProduct, setQuickProduct] = useState(null);

	const { addToCart } = useCart();
	const user = useMe();
	const { wishlist, toggleWishlist } = useWishlist(user?.id);

	const queryKey = useMemo(
		() => [
			"shop",
			{
				page,
				limit,
				search,
				category,
				sort,
				minPrice,
				maxPrice,
				stockOnly,
			},
		],
		[page, limit, search, category, sort, minPrice, maxPrice, stockOnly]
	);

	const { data, isLoading, isFetching } = useQuery({
		queryKey,
		queryFn: () =>
			fetchProducts({
				page,
				limit,
				search,
				category: category === "all" ? "" : category,
				sort,
				minPrice: minPrice === "" ? undefined : minPrice,
				maxPrice: maxPrice === "" ? undefined : maxPrice,
				stock: stockOnly ? "true" : undefined,
			}),
		staleTime: 1000 * 60 * 2,
	});

	const products = data?.products || [];
	const total = data?.total || 0;
	const pages = data?.pages || 1;

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setPage(1);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			{/* Top Bar */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sticky top-0 bg-white z-40 py-3">
				<h1 className="text-3xl font-bold text-primary">
					Shop Products
				</h1>

				<form
					onSubmit={handleSearchSubmit}
					className="flex gap-2 w-full md:w-[400px]">
					<div className="relative flex-1">
						<FiSearch className="absolute left-3 top-3 text-gray-400" />
						<input
							className="border pl-10 pr-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400"
							placeholder="Search products..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium">
						Search
					</button>
				</form>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				{/* Sidebar */}
				<div className="lg:col-span-1 bg-white border rounded-lg p-4 h-fit sticky top-24">
					<div className="flex items-center gap-2 mb-4 font-semibold text-lg">
						<FiFilter /> Filters
					</div>

					<div className="space-y-4">
						{/* Category */}
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

						{/* Sort */}
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

						{/* Price */}
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

						{/* In Stock */}
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

						{/* Reset */}
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

				{/* Products */}
				<div className="lg:col-span-4">
					<div className="flex justify-between items-center mb-4 text-sm text-gray-600">
						<div>
							{isFetching
								? "Updating..."
								: `${total} products found`}
						</div>
						<div>
							Page {page} / {pages}
						</div>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="h-60 bg-gray-200 rounded animate-pulse"
								/>
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
							{products.map((p) => (
								<ProductCard
									key={String(p._id)}
									product={p}
									onQuickView={() => setQuickProduct(p)}
									onAddToCart={() => addToCart(String(p._id))}
									onToggleWishlist={() =>
										toggleWishlist(String(p._id))
									}
									isWishlisted={wishlist.includes(p._id)}
								/>
							))}
						</div>
					)}

					<div className="mt-8 flex justify-center">
						<Pagination
							page={page}
							pages={pages}
							onPageChange={(p) => setPage(p)}
						/>
					</div>
				</div>
			</div>

			{/* Quick View Modal */}
			{quickProduct && (
				<QuickViewModal
					product={quickProduct}
					onClose={() => setQuickProduct(null)}
					onAddToCart={(id) => addToCart(id)}
					onToggleWishlist={(id) => toggleWishlist(id)}
					isWishlisted={wishlist.includes(quickProduct._id)}
				/>
			)}
		</div>
	);
}
