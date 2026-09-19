export type CustomisationOption = {
  id: string;
  label: string;
  value: string;
  color_hex: string | null;
  is_light_color: boolean;
  display_order: number;
  is_available: boolean;
  group_id: string;
};

export type CustomisationGroup = {
  id: string;
  name: string;
  type: "swatch" | "chip" | "text";
  display_order: number;
  is_required: boolean;
  options: CustomisationOption[];
  compatibility_rules?: Record<string, string[]>;
};

export type CustomisationTextField = {
  id: string;
  label: string;
  placeholder: string;
  max_chars: number;
  is_required: boolean;
};

export type CustomisationConfig = {
  groups: CustomisationGroup[];
  text_field: CustomisationTextField | null;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export async function fetchProductCustomisation(productId: string): Promise<CustomisationConfig | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/products/${productId}/customisation`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.log("Error fetching customisation config:", error instanceof Error ? error.message : String(error));
    return null;
  }
}
