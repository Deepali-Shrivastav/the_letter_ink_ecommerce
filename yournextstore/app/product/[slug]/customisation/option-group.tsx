import { ReactNode } from "react";

export function OptionGroup({
  name,
  isRequired,
  error,
  children
}: {
  name: string;
  isRequired: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 border-b border-border-vellum/50 last:border-b-0">
      <div className="flex justify-between items-baseline">
        <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary">
          {name}
          {isRequired && <span className="ml-1 text-red-700">*</span>}
        </h3>
        {error && <span className="text-red-700 font-label-sm text-xs">{error}</span>}
      </div>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}
