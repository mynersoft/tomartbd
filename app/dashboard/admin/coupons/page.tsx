"use client";

import { useState } from "react";
import {
	useCoupons,
	useCreateCoupon,
	useUpdateCoupon,
	useDeleteCoupon,
} from "@/hooks/useAdminCoupon";

export default function AdminCouponPage() {
	const { data: coupons = [] } = useCoupons();
	const createMutation = useCreateCoupon();
	const updateMutation = useUpdateCoupon();
	const deleteMutation = useDeleteCoupon();

	const [form, setForm] = useState({
		code: "",
		discount: 0,
		expiry: "",
		usageLimit: 1,
	});

	const [editId, setEditId] = useState<string | null>(null);

	const handleSubmit = () => {
		if (editId) {
			updateMutation.mutate({
				id: editId,
				...form,
			});
			setEditId(null);
		} else {
			createMutation.mutate(form);
		}

		setForm({
			code: "",
			discount: 0,
			expiry: "",
			usageLimit: 1,
		});
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Coupon Management</h1>

			{/* Form */}
			<div className="mb-6 flex flex-wrap gap-2 items-end">
				<input
					type="text"
					placeholder="Code"
					value={form.code}
					onChange={(e) => setForm({ ...form, code: e.target.value })}
					className="border px-2 py-1 rounded"
				/>

				<input
					type="number"
					placeholder="Discount %"
					value={form.discount}
					onChange={(e) =>
						setForm({ ...form, discount: Number(e.target.value) })
					}
					className="border px-2 py-1 rounded"
				/>

				<input
					type="date"
					value={form.expiry}
					onChange={(e) =>
						setForm({ ...form, expiry: e.target.value })
					}
					className="border px-2 py-1 rounded"
				/>

				<input
					type="number"
					placeholder="Usage Limit"
					value={form.usageLimit}
					onChange={(e) =>
						setForm({ ...form, usageLimit: Number(e.target.value) })
					}
					className="border px-2 py-1 rounded w-24"
				/>

				<button
					onClick={handleSubmit}
					className="bg-blue-600 text-white px-4 py-1 rounded">
					{editId ? "Update" : "Add"}
				</button>
			</div>

			{/* Table */}
			<table className="w-full border">
				<thead>
					<tr className="bg-gray-200">
						<th className="border px-2 py-1">Code</th>
						<th className="border px-2 py-1">Discount</th>
						<th className="border px-2 py-1">Expiry</th>
						<th className="border px-2 py-1">Usage</th>
						<th className="border px-2 py-1">Actions</th>
					</tr>
				</thead>
				<tbody>
					{coupons.map((c: any) => (
						<tr key={c._id}>
							<td className="border px-2 py-1">{c.code}</td>
							<td className="border px-2 py-1">{c.discount}%</td>
							<td className="border px-2 py-1">
								{new Date(c.expiry).toLocaleDateString()}
							</td>
							<td className="border px-2 py-1">
								{c.used} / {c.usageLimit}
							</td>
							<td className="border px-2 py-1 flex gap-2">
								<button
									onClick={() => {
										setEditId(c._id);
										setForm({
											code: c.code,
											discount: c.discount,
											expiry: c.expiry.split("T")[0],
											usageLimit: c.usageLimit,
										});
									}}
									className="bg-yellow-500 text-white px-2 py-1 rounded">
									Edit
								</button>

								<button
									onClick={() => deleteMutation.mutate(c._id)}
									className="bg-red-600 text-white px-2 py-1 rounded">
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
