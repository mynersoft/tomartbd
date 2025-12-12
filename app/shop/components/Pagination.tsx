// app/shop/components/Pagination.tsx
"use client";

export default function Pagination({
	page,
	pages,
	onPageChange,
}: {
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-2">
			<button
				onClick={() => onPageChange(Math.max(1, page - 1))}
				disabled={page <= 1}
				className="px-3 py-1 border rounded disabled:opacity-50">
				Prev
			</button>
			<div className="px-3 py-1 border rounded">
				Page {page} / {pages}
			</div>
			<button
				onClick={() => onPageChange(Math.min(pages, page + 1))}
				disabled={page >= pages}
				className="px-3 py-1 border rounded disabled:opacity-50">
				Next
			</button>
		</div>
	);
}
