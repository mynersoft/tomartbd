// components/ui/Select.tsx
"use client";

type Props = {
	label?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { label: string; value: string }[];
};

export default function Select({ label, value, onChange, options }: Props) {
	return (
		<div className="space-y-1">
			{label && (
				<label className="text-sm font-medium">{label}</label>
			)}
			<select
				value={value}
				onChange={onChange}
				className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500">
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
}