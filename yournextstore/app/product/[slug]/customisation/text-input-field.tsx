import { CustomisationTextField } from "@/lib/customisation-api";

export function TextInputField({
  config,
  value,
  onChange,
  error
}: {
  config: CustomisationTextField;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="font-label-md text-label-md uppercase tracking-widest text-primary">
          {config.label}
          {config.is_required && <span className="ml-1 text-red-700">*</span>}
        </label>
        <span className="text-xs text-secondary">
          [{value.length}/{config.max_chars}]
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= config.max_chars) {
            onChange(e.target.value);
          }
        }}
        placeholder={config.placeholder}
        className="w-full bg-surface-container border border-border-vellum p-3 text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[80px]"
      />
      {error && <span className="text-red-700 font-label-sm text-xs">{error}</span>}
    </div>
  );
}
