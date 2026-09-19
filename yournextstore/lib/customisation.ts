export type CustomisationOption = {
  id: string;
  label: string;
  value: string;
  color_hex?: string | null;
  is_light_color?: boolean;
};

export type CustomisationGroup = {
  id: string;
  name: string;
  type: "swatch" | "chip" | "text";
  is_required: boolean;
  options: CustomisationOption[];
};

export type CustomisationTextField = {
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

export async function getProductCustomisation(productId: string): Promise<CustomisationConfig | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/products/${productId}/customisation`, {
      next: { tags: [`product_customisation_${productId}`], revalidate: 3600 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
