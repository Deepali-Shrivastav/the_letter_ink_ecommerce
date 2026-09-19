"use client";

import { useState, useEffect } from "react";
import type { CustomisationConfig, CustomisationGroup, CustomisationOption } from "@/lib/customisation";
import { cn } from "@/lib/utils";

type CustomisationSelections = Record<string, CustomisationOption | null>;

interface CustomisationPanelProps {
  config: CustomisationConfig;
  onChange: (selections: CustomisationSelections, isComplete: boolean) => void;
  onInscriptionChange: (text: string) => void;
}

export function CustomisationPanel({ config, onChange, onInscriptionChange }: CustomisationPanelProps) {
  const [selections, setSelections] = useState<CustomisationSelections>(
    config.groups.reduce((acc, group) => ({ ...acc, [group.id]: null }), {})
  );
  const [inscription, setInscription] = useState("");

  const paperSelection = config.groups.find(g => g.name.toLowerCase().includes("paper"))?.id 
    ? selections[config.groups.find(g => g.name.toLowerCase().includes("paper"))!.id] 
    : null;

  const handleSelect = (groupId: string, option: CustomisationOption) => {
    setSelections(prev => {
      const next = { ...prev, [groupId]: option };
      
      const isPaperGroup = config.groups.find(g => g.id === groupId)?.name.toLowerCase().includes("paper");
      if (isPaperGroup) {
        const inkGroupId = config.groups.find(g => g.name.toLowerCase().includes("ink"))?.id;
        if (inkGroupId) {
          const currentInk = next[inkGroupId];
          if (currentInk) {
            const paperIsLight = option.is_light_color ?? false;
            const inkIsLight = currentInk.is_light_color ?? false;
            if ((paperIsLight && inkIsLight) || (!paperIsLight && !inkIsLight)) {
              next[inkGroupId] = null; 
            }
          }
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const requiredGroups = config.groups.filter(g => g.is_required);
    const isComplete = requiredGroups.every(g => selections[g.id] !== null);
    const textComplete = !config.text_field || !config.text_field.is_required || (inscription.trim().length > 0);

    onChange(selections, isComplete && textComplete);
  }, [selections, inscription, config, onChange]);

  const allRequiredGroupsSelected = config.groups.filter(g => g.is_required).every(g => selections[g.id] !== null);

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 border-b border-border-vellum">
      {config.groups.map((group, index) => {
        const prevGroup = index > 0 ? config.groups[index - 1] : null;
        const isLocked = prevGroup && prevGroup.is_required && !selections[prevGroup.id];
        
        const isInkGroup = group.name.toLowerCase().includes("ink");
        let displayOptions = group.options;
        
        if (isInkGroup && paperSelection) {
          const paperIsLight = paperSelection.is_light_color ?? false;
          displayOptions = group.options.map(opt => ({
            ...opt,
            _disabled: paperIsLight ? opt.is_light_color : !opt.is_light_color 
          }));
        }

        return (
          <div key={group.id} className={cn("flex flex-col gap-3 transition-opacity duration-300", isLocked && "opacity-50 pointer-events-none")}>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                {index + 1}. {group.name} {group.is_required && "*"}
              </span>
              {selections[group.id] && (
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {selections[group.id]?.label}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {displayOptions.map((opt: any) => {
                const isSelected = selections[group.id]?.id === opt.id;
                const isDisabled = opt._disabled;
                
                if (group.type === "swatch") {
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelect(group.id, opt)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                        isSelected ? "border-primary p-0.5" : "border-transparent",
                        isDisabled ? "opacity-20 cursor-not-allowed" : "hover:border-primary/50"
                      )}
                      title={opt.label}
                    >
                      <span 
                        className="w-full h-full rounded-full border border-border-vellum block" 
                        style={{ backgroundColor: opt.color_hex || "#cccccc" }}
                      />
                    </button>
                  );
                }
                
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(group.id, opt)}
                    className={cn(
                      "px-4 py-2 font-body-sm text-body-sm border transition-colors",
                      isSelected ? "bg-primary text-on-primary border-primary" : "bg-transparent text-primary border-border hover:border-primary",
                      isDisabled && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {config.text_field && (
        <div className={cn("flex flex-col gap-3 transition-all duration-500", allRequiredGroupsSelected ? "opacity-100 mt-2" : "opacity-0 h-0 overflow-hidden")}>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              {config.text_field.label} {config.text_field.is_required && "*"}
            </span>
            <span className="font-body-sm text-[12px] text-on-surface-variant">
              {inscription.length} / {config.text_field.max_chars}
            </span>
          </div>
          <textarea
            value={inscription}
            onChange={(e) => {
              if (e.target.value.length <= (config.text_field?.max_chars || 120)) {
                setInscription(e.target.value);
                onInscriptionChange(e.target.value);
              }
            }}
            placeholder={config.text_field.placeholder}
            className="w-full min-h-[100px] p-4 bg-surface-container-lowest border border-border-vellum focus:border-primary focus:ring-0 resize-none font-body-md text-body-md text-on-surface"
          />
        </div>
      )}
    </div>
  );
}
