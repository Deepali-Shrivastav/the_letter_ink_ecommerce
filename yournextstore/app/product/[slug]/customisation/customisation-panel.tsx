"use client";

import { CustomisationConfig } from "@/lib/customisation-api";
import { OptionGroup } from "./option-group";
import { SwatchSelector } from "./swatch-selector";
import { ChipSelector } from "./chip-selector";
import { TextInputField } from "./text-input-field";

type CustomisationPanelProps = {
  config: CustomisationConfig;
  hook: ReturnType<typeof import("./use-customisation").useCustomisation>;
};

export function CustomisationPanel({ config, hook }: CustomisationPanelProps) {
  if (!config || (config.groups.length === 0 && !config.text_field)) {
    return null;
  }

  const { selections, setSelection, customText, setCustomText, compatibleOptions, errors } = hook;

  return (
    <div className="flex flex-col gap-1 border border-border-vellum p-4 bg-paper-tint/30 mt-4 mb-2">
      <h2 className="font-headline-sm text-headline-sm mb-2 text-primary">Customise Your Order</h2>
      
      {config.groups.map(group => {
        const options = compatibleOptions[group.id] || [];
        
        return (
          <OptionGroup 
            key={group.id} 
            name={group.name} 
            isRequired={group.is_required}
            error={errors[group.id]}
          >
            {group.type === "swatch" && (
              <SwatchSelector 
                options={options} 
                selectedId={selections[group.id]} 
                onChange={(id) => setSelection(group.id, id)} 
              />
            )}
            
            {group.type === "chip" && (
              <ChipSelector 
                options={options} 
                selectedId={selections[group.id]} 
                onChange={(id) => setSelection(group.id, id)} 
              />
            )}
            
            {/* If there's a text type group (not the common text field) */}
            {group.type === "text" && (
              <div className="text-secondary italic text-sm">Text option group not fully implemented in UI</div>
            )}
          </OptionGroup>
        );
      })}

      {config.text_field && (
        <div className="py-4 mt-2">
          <TextInputField 
            config={config.text_field} 
            value={customText} 
            onChange={setCustomText}
            error={errors["text_field"]}
          />
        </div>
      )}
    </div>
  );
}
