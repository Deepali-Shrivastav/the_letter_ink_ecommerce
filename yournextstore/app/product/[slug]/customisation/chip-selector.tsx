import { CustomisationOption } from "@/lib/customisation-api";
import { cn } from "@/lib/utils";

type ChipOption = CustomisationOption & { is_compatible: boolean };

export function ChipSelector({ 
  options, 
  selectedId, 
  onChange 
}: { 
  options: ChipOption[]; 
  selectedId?: string; 
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          disabled={!opt.is_compatible || !opt.is_available}
          onClick={() => onChange(opt.id)}
          className={cn(
            "px-4 py-2 border text-sm transition-all duration-200",
            selectedId === opt.id 
              ? "bg-primary border-primary text-on-primary" 
              : "bg-surface-container-low border-border-vellum text-primary hover:border-primary",
            (!opt.is_compatible || !opt.is_available) && "opacity-50 cursor-not-allowed bg-surface-container hover:border-border-vellum text-secondary"
          )}
          title={!opt.is_compatible ? `${opt.label} (Incompatible)` : opt.label}
        >
          <div className="flex flex-col items-start text-left">
            <span>{opt.label}</span>
            {!opt.is_compatible && (
              <span className="text-[10px] uppercase tracking-wider text-secondary mt-0.5">Incompatible</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
