// components/ui/Input.tsx
"use client";

type Props = {
	label?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
};

export default function Input({
	label,
	type = "text",
	placeholder,
	value,
	onChange,
	className = "",
}: Props) {
	return (
		<div className="space-y-1">
			{label && (
				<label className="text-sm font-medium">{label}</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
			/>
		</div>
	);
}