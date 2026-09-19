import { useState, useMemo } from "react";
import { CustomisationConfig, CustomisationOption } from "@/lib/customisation-api";

export function useCustomisation(config: CustomisationConfig | null) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customText, setCustomText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derive compatible options for each group based on current selections
  const compatibleOptions = useMemo(() => {
    if (!config) return {};

    const available: Record<string, CustomisationOption[]> = {};
    const validTargets = new Set<string>();
    let hasRules = false;

    // Collect all valid target options from all selected options' rules
    config.groups.forEach(group => {
      const selectedId = selections[group.id];
      const selectedOption = group.options.find(o => o.id === selectedId);
      
      if (selectedOption && group.compatibility_rules?.[selectedOption.value]) {
        hasRules = true;
        group.compatibility_rules[selectedOption.value].forEach(id => validTargets.add(id));
      }
    });

    // Filter options for each group
    config.groups.forEach(group => {
      // We only filter if there are actually some rules in effect
      if (hasRules && group.compatibility_rules === undefined) {
        // If a group has NO rules attached, we assume its options MIGHT be targets of other rules.
        // We filter them to only those in the validTargets set.
        // Wait, a better logic: an option is compatible if it's either not restricted by any rule,
        // or it is in the validTargets set.
        // But the requirement says: "ink availability must depend on selected paper color".
        // Let's implement this: if ANY selection dictates targets, options not in those targets (for dependent groups) are invalid.
        // For simplicity: any group that isn't the source of rules is treated as a dependent.
        available[group.id] = group.options.map(opt => ({
          ...opt,
          is_compatible: validTargets.has(opt.id) || !hasRules // fallback logic if needed
        })) as any;
      } else {
        // This is a source group, all its options are valid (it drives the rules)
        available[group.id] = group.options.map(opt => ({ ...opt, is_compatible: true })) as any;
      }
    });

    // A simpler strict logic based on our specific schema:
    config.groups.forEach(group => {
      // A group's options are valid if they are explicitly allowed by ANY selected source option,
      // UNLESS no source option that restricts this group is selected yet.
      
      let isRestrictedGroup = false;
      let allowedOptionIds = new Set<string>();
      
      config.groups.forEach(sourceGroup => {
        if (sourceGroup.id === group.id) return; // Don't restrict self
        const selectedOptId = selections[sourceGroup.id];
        const selectedOpt = sourceGroup.options.find(o => o.id === selectedOptId);
        
        if (selectedOpt && sourceGroup.compatibility_rules?.[selectedOpt.value]) {
          const targets = sourceGroup.compatibility_rules[selectedOpt.value];
          // If the targets belong to our group, then our group IS restricted by this selection
          const groupOptionIds = group.options.map(o => o.id);
          const relevantTargets = targets.filter(t => groupOptionIds.includes(t));
          
          if (relevantTargets.length > 0) {
            isRestrictedGroup = true;
            relevantTargets.forEach(t => allowedOptionIds.add(t));
          }
        }
      });

      available[group.id] = group.options.map(opt => ({
        ...opt,
        is_compatible: !isRestrictedGroup || allowedOptionIds.has(opt.id)
      })) as (CustomisationOption & { is_compatible: boolean })[];
    });

    return available;
  }, [config, selections]);

  const setSelection = (groupId: string, optionId: string) => {
    setSelections(prev => {
      const next = { ...prev, [groupId]: optionId };
      // Optional: Auto-clear incompatible selections
      if (config) {
        // We should recalculate compatibility with the NEW state to see if any OTHER group's selection is now invalid
        // But React state doesn't allow sync read of the new computed compatibleOptions.
        // We'll leave them selected but they will render as incompatible, or we can clear them.
        // Let's clear them on next render if invalid, or just let the user see it's invalid.
      }
      return next;
    });
    // Clear error for this group
    if (errors[groupId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[groupId];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    if (!config) return true;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.groups.forEach(group => {
      if (group.is_required && !selections[group.id]) {
        newErrors[group.id] = "Please make a selection";
        isValid = false;
      }
    });

    if (config.text_field?.is_required && !customText.trim()) {
      newErrors["text_field"] = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const buildMetadata = () => {
    if (!config) return undefined;
    
    const customisationData = Object.fromEntries(
      config.groups.map(group => {
        const optionId = selections[group.id];
        const option = group.options.find(o => o.id === optionId);
        return [
          group.name.toLowerCase().replace(/ /g, "_"), 
          option ? {
            option_id: option.id,
            label: option.label,
            value: option.value,
          } : null
        ];
      }).filter(([, v]) => v !== null)
    );

    if (customText.trim()) {
      customisationData["custom_text"] = customText.trim();
    }

    return Object.keys(customisationData).length > 0 ? customisationData : undefined;
  };

  return { 
    selections, 
    setSelection, 
    customText, 
    setCustomText,
    compatibleOptions, 
    errors, 
    validate, 
    buildMetadata,
    isValid: Object.keys(errors).length === 0
  };
}
