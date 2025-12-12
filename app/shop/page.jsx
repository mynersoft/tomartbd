"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts.js";
import ProductCard from "../../components/Product/ProductCard";

export default function ShopPage() {
	const { data: products, isLoading, isError } = useProducts();
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sort, setSort] = useState("default");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	if (isLoading)
		return <p className="text-center mt-10">Loading products...</p>;
	if (isError)
		return (
			<p className="text-center mt-10 text-red-500">
				Failed to load products
			</p>
		);

	// Filter products
	let filteredProducts = products.filter((p) => {
		return (
			(p.name.toLowerCase().includes(search.toLowerCase()) ||
				p.tags?.some((tag) =>
					tag.toLowerCase().includes(search.toLowerCase())
				)) &&
			(categoryFilter === "all" || p.category === categoryFilter)
		);
	});

	// Sort products
	if (sort === "price-low") {
		filteredProducts.sort(
			(a, b) =>
				a.price -
				(a.discount ? a.price * (a.discount / 100) : 0) -
				(b.price - (b.discount ? b.price * (b.discount / 100) : 0))
		);
	} else if (sort === "price-high") {
		filteredProducts.sort(
			(a, b) =>
				b.price -
				(b.discount ? b.price * (b.discount / 100) : 0) -
				(a.price - (a.discount ? a.price * (a.discount / 100) : 0))
		);
	}

	// Pagination
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const categories = [
		"all",
		"electronics",
		"mobile",
		"fashion",
		"hardware",
		"other",
	];

	return (
		<div className="max-w-7xl  mx-auto p-4 flex flex-col md:flex-row gap-6">
			{/* Sidebar */}
			<aside className="w-full md:w-1/4 bg-white p-4 shadow rounded">
				<h2 className="font-bold text-lg mb-4">Categories</h2>
				<ul className="flex flex-col gap-2">
					{categories.map((cat) => (
						<li key={cat}>
							<button
								className={`w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${
									categoryFilter === cat
										? "bg-blue-600 text-white"
										: ""
								}`}
								onClick={() => setCategoryFilter(cat)}>
								{cat.charAt(0).toUpperCase() + cat.slice(1)}
							</button>
						</li>
					))}
				</ul>

				<div className="mt-6">
					<h2 className="font-bold text-lg mb-2">Search</h2>
					<input
						type="text"
						placeholder="Search products..."
						className="w-full border px-3 py-2 rounded"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="mt-6">
					<h2 className="font-bold text-lg mb-2">Sort By</h2>
					<select
						className="w-full border px-3 py-2 rounded"
						value={sort}
						onChange={(e) => setSort(e.target.value)}>
						<option value="default">Default</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
					</select>
				</div>
			</aside>

			{/* Products Grid */}
			<main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{paginatedProducts.length === 0 ? (
					<p className="col-span-full text-center text-gray-500 mt-10">
						No products found
					</p>
				) : (
					<>
						{products.map((product) => (
							<ProductCard key={product._id}
								product={product} />
						))}
					</>
				)}

				{/* Pagination */}
				<div className="w-full flex justify-center mt-6 gap-2 col-span-full">
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i + 1}
							className={`px-3 py-1 rounded border ${
								currentPage === i + 1
									? "bg-blue-600 text-white"
									: ""
							}`}
							onClick={() => setCurrentPage(i + 1)}>
							{i + 1}
						</button>
					))}
				</div>
			</main>
		</div>
	);
}
