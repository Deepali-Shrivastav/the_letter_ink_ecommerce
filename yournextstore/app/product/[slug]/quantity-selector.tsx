"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center bg-surface-container-low px-2">
			<button
				type="button"
				className="w-8 h-10 flex items-center justify-center text-primary hover:text-secondary disabled:opacity-50"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<span className="material-symbols-outlined text-[18px]">remove</span>
			</button>
			<input
				type="text"
				readOnly
				value={quantity}
				className="w-8 text-center bg-transparent font-label-md text-label-md text-primary focus:outline-none"
			/>
			<button
				type="button"
				className="w-8 h-10 flex items-center justify-center text-primary hover:text-secondary disabled:opacity-50"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<span className="material-symbols-outlined text-[18px]">add</span>
			</button>
		</div>
	);
}
