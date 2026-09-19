import { CustomisationOption } from "@/lib/customisation-api";
import { cn } from "@/lib/utils";

type SwatchOption = CustomisationOption & { is_compatible: boolean };

export function SwatchSelector({ 
  options, 
  selectedId, 
  onChange 
}: { 
  options: SwatchOption[]; 
  selectedId?: string; 
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          disabled={!opt.is_compatible || !opt.is_available}
          onClick={() => onChange(opt.id)}
          className={cn(
            "w-10 h-10 rounded-full transition-all duration-200 border relative",
            "flex items-center justify-center",
            selectedId === opt.id 
              ? "ring-2 ring-primary ring-offset-2 border-transparent" 
              : "border-border-vellum hover:scale-105",
            (!opt.is_compatible || !opt.is_available) && "opacity-40 cursor-not-allowed hover:scale-100"
          )}
          style={{ backgroundColor: opt.color_hex || "#e5e5e5" }}
          aria-label={opt.label}
          title={!opt.is_compatible ? `${opt.label} (Incompatible)` : opt.label}
        >
          {/* If selected and dark color, show light checkmark, else dark checkmark */}
          {selectedId === opt.id && (
            <span className={cn(
              "material-symbols-outlined text-sm font-bold",
              opt.is_light_color ? "text-primary" : "text-white"
            )}>
              check
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
