"use client";

import { Minus, Plus } from "lucide-react";

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
		<div className="flex items-center h-[49px] bg-surface-container-low border border-border-vellum rounded-sm transition-colors">
			<button
				type="button"
				className="w-11 h-[49px] flex items-center justify-center text-primary hover:text-brand-script disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="w-4 h-4" />
			</button>
			<input
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				role="spinbutton"
				aria-label="Quantity"
				aria-valuenow={quantity}
				aria-valuemin={min}
				aria-valuemax={max}
				readOnly
				value={quantity}
				onKeyDown={(e) => {
					if (e.key === "ArrowUp") {
						e.preventDefault();
						onQuantityChange(Math.min(max, quantity + 1));
					} else if (e.key === "ArrowDown") {
						e.preventDefault();
						onQuantityChange(Math.max(min, quantity - 1));
					}
				}}
				className="w-10 text-center bg-transparent font-label-md text-label-md text-primary font-medium focus:outline-none select-none tabular-nums"
			/>
			<span className="sr-only" aria-live="polite">
				Quantity: {quantity}
			</span>
			<button
				type="button"
				className="w-11 h-[49px] flex items-center justify-center text-primary hover:text-brand-script disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="w-4 h-4" />
			</button>
		</div>
	);
}
