"use client";

import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border-vellum group-[.toaster]:shadow-sm group-[.toaster]:font-sans group-[.toaster]:rounded-sm",
					description: "group-[.toast]:text-secondary",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-on-primary group-[.toast]:rounded-sm font-medium",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-sm",
				},
			}}
			icons={{
				success: <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />,
				info: <InfoIcon className="size-4 text-primary" />,
				warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
				error: <OctagonXIcon className="size-4 text-red-600 dark:text-red-400" />,
				loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
			}}
			style={
				{
					"--normal-bg": "var(--card, #fff)",
					"--normal-text": "var(--foreground, #201a1c)",
					"--normal-border": "var(--border-vellum, #e5dcd6)",
					"--border-radius": "4px",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
