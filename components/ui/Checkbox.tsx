// components/ui/Checkbox.tsx
"use client";

type Props = {
	label: string;
	checked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({ label, checked, onChange }: Props) {
	return (
		<label className="flex items-center space-x-2 cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="w-4 h-4"
			/>
			<span className="text-sm">{label}</span>
		</label>
	);
}