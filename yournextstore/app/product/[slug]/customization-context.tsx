"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type CustomizationOptionValue = {
  id: string;
  value: string;
  option_id?: string;
};

export type CustomizationOption = {
  id: string;
  title: string;
  values: CustomizationOptionValue[];
};

export type CustomizationCombination = {
  id: string;
  preview_image_url: string | null;
  price_adjustment: number | null;
  values: CustomizationOptionValue[];
};

type CustomizationContextType = {
  options: CustomizationOption[];
  combinations: CustomizationCombination[];
  loading: boolean;
  selections: Record<string, string>; // optionId -> valueId
  selectedValuesByName: Record<string, string>; // optionTitle -> valueName
  matchedCombination: CustomizationCombination | null;
  previewImageUrl: string | null;
  setOptionValue: (optionId: string, valueId: string, optionTitle: string, valueName: string) => void;
};

const CustomizationContext = createContext<CustomizationContextType>({
  options: [],
  combinations: [],
  loading: false,
  selections: {},
  selectedValuesByName: {},
  matchedCombination: null,
  previewImageUrl: null,
  setOptionValue: () => {},
});

export function ProductCustomizationProvider({
  productId,
  children,
}: {
  productId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [combinations, setCombinations] = useState<CustomizationCombination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, string>>({}); // optionId -> valueId

  // Fetch options and combinations for this product
  useEffect(() => {
    if (!productId) return;

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
      "pk_22aed401e4e1f40b61fb80d5528e4dfdf39a82188d2af4d2cf11d396977ce54c";

    fetch(`${backendUrl}/store/products/${productId}/customizations`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const fetchedOptions: CustomizationOption[] = data.options || [];
        const fetchedCombinations: CustomizationCombination[] = data.combinations || [];
        setOptions(fetchedOptions);
        setCombinations(fetchedCombinations);

        // Only populate selections from URL query params; do not default to any values (start blank)
        const initialSelections: Record<string, string> = {};
        fetchedOptions.forEach((opt) => {
          const fromParam = searchParams.get(opt.title);
          if (fromParam) {
            const matchedVal = opt.values.find((v) => v.value === fromParam);
            if (matchedVal) {
              initialSelections[opt.id] = matchedVal.id;
            }
          }
        });

        setSelections(initialSelections);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch customizations", err);
        setLoading(false);
      });
  }, [productId]);

  // Handle setting an option value (supports toggling off to blank)
  const setOptionValue = (
    optionId: string,
    valueId: string,
    optionTitle: string,
    valueName: string
  ) => {
    const isCurrentlySelected = selections[optionId] === valueId;

    if (isCurrentlySelected) {
      // Toggle off / deselect back to blank
      setSelections((prev) => {
        const updated = { ...prev };
        delete updated[optionId];
        return updated;
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete(optionTitle);
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    } else {
      // Select value
      setSelections((prev) => ({
        ...prev,
        [optionId]: valueId,
      }));

      const params = new URLSearchParams(searchParams.toString());
      params.set(optionTitle, valueName);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // Compute selectedValuesByName (title -> value string)
  const selectedValuesByName = useMemo(() => {
    const result: Record<string, string> = {};
    options.forEach((opt) => {
      const selectedValueId = selections[opt.id];
      if (selectedValueId) {
        const val = opt.values.find((v) => v.id === selectedValueId);
        if (val) {
          result[opt.title] = val.value;
        }
      }
    });
    return result;
  }, [options, selections]);

  // Dynamically resolve matching combination
  const matchedCombination = useMemo(() => {
    if (combinations.length === 0) return null;
    const selectedValueIds = Object.values(selections);
    if (selectedValueIds.length === 0) return null;

    // Find all combinations where EVERY value in the combination is matched in user's selections
    const matches = combinations.filter((comb) => {
      if (!comb.values || comb.values.length === 0) return false;
      return comb.values.every((v) => selectedValueIds.includes(v.id));
    });

    if (matches.length === 0) return null;

    // Sort by most specific (highest number of matching option values)
    matches.sort((a, b) => b.values.length - a.values.length);
    return matches[0];
  }, [combinations, selections]);

  const previewImageUrl = matchedCombination?.preview_image_url || null;

  return (
    <CustomizationContext.Provider
      value={{
        options,
        combinations,
        loading,
        selections,
        selectedValuesByName,
        matchedCombination,
        previewImageUrl,
        setOptionValue,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  return useContext(CustomizationContext);
}
