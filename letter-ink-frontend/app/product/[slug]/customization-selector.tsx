"use client";

import { useEffect, useRef } from "react";
import { useCustomization } from "./customization-context";
import { cn } from "@/lib/utils";

type CustomizationSelectorProps = {
  productId?: string;
  onCombinationResolved?: (combination: any, selectedValues: Record<string, string>) => void;
};

export function CustomizationSelector({ onCombinationResolved }: CustomizationSelectorProps) {
  const {
    options,
    loading,
    selections,
    selectedValuesByName,
    matchedCombination,
    setOptionValue,
  } = useCustomization();

  const onResolvedRef = useRef(onCombinationResolved);
  useEffect(() => {
    onResolvedRef.current = onCombinationResolved;
  }, [onCombinationResolved]);

  const lastReportedRef = useRef<string>("");

  useEffect(() => {
    if (!onResolvedRef.current || loading) return;

    const reportKey = JSON.stringify({
      combId: matchedCombination?.id ?? null,
      selections: selectedValuesByName,
    });

    if (lastReportedRef.current !== reportKey) {
      lastReportedRef.current = reportKey;
      onResolvedRef.current(matchedCombination, selectedValuesByName);
    }
  }, [matchedCombination, selectedValuesByName, loading]);

  if (loading || options.length === 0) return null;

  return (
    <div className="space-y-6 pt-5 pb-3 border-t border-border/60">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
          Bespoke Customization Options
        </span>
        <span className="text-xs text-secondary/80 font-mono">
          {options.length} options available
        </span>
      </div>

      {options.map((group) => {
        const selectedValueId = selections[group.id];

        return (
          <fieldset key={group.id} className="border-0 p-0 m-0">
            <div className="mb-2.5 flex items-center justify-between">
              <legend className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-medium">
                {group.title}
              </legend>
              {selectedValueId && (
                <span className="text-xs text-secondary font-medium">
                  {group.values.find((v) => v.id === selectedValueId)?.value}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {group.values.map((option) => {
                const isSelected = selectedValueId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setOptionValue(group.id, option.id, group.title, option.value)
                    }
                    className={cn(
                      "px-3.5 py-2 text-xs uppercase tracking-wider transition-all duration-200 border rounded-sm",
                      isSelected
                        ? "bg-primary text-on-primary border-primary font-semibold shadow-sm scale-[1.02]"
                        : "bg-surface-container-low text-primary border-border/80 hover:border-primary/50 hover:bg-paper-tint",
                    )}
                  >
                    <span>{option.value}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
