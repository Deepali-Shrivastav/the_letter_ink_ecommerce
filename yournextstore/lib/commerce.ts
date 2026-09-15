import { medusaClient } from "./medusa";
import { cacheLife } from "next/cache";

// Map Medusa Product to YNS Product Shape
const mapMedusaProductToYNS = (medusaProduct: any) => {
  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    slug: medusaProduct.handle,
    summary: medusaProduct.subtitle || medusaProduct.description?.substring(0, 100),
    content: medusaProduct.description,
    images: medusaProduct.images ? medusaProduct.images.map((img: any) => img.url) : (medusaProduct.thumbnail ? [medusaProduct.thumbnail] : []),
    variants: medusaProduct.variants ? medusaProduct.variants.map((v: any) => {
      // Find the price (in cents, represented as a string for YNS)
      // Medusa v2 typically has `calculated_price` or a `price` property on variants if queried with a region/currency,
      // but as a fallback we mock "1000" (10.00).
      const priceStr = v.prices && v.prices.length > 0 ? String(v.prices[0].amount) : "1000";
      
      return {
        id: v.id,
        name: v.title,
        price: priceStr,
        originalPrice: priceStr,
        currency: "usd",
        images: [],
        sku: v.sku || null,
        stock: v.inventory_quantity ?? 100,
        omnibusPrice: null,
        combinations: v.options ? v.options.map((o: any) => {
          // Medusa provides option_id to link back to the product option, but if we don't look it up,
          // we can just mock the label (e.g. "Size" or "Color") or try to find it.
          const parentOption = medusaProduct.options?.find((po: any) => po.id === o.option_id);
          const label = parentOption?.title || "Option";
          
          return {
            variantValue: {
              id: o.id || o.value,
              value: o.value,
              colorValue: label.toLowerCase() === "color" ? o.value : null,
              variantType: {
                id: o.option_id || "opt_1",
                type: label.toLowerCase() === "color" ? "color" : "string",
                label: label
              }
            }
          };
        }) : []
      };
    }) : [],
    category: medusaProduct.collection ? {
      name: medusaProduct.collection.title,
      slug: medusaProduct.collection.handle
    } : null,
    seo: {
      title: medusaProduct.title,
      description: medusaProduct.description?.substring(0, 150)
    },
    type: "standard", // Not a bundle
    options: medusaProduct.options ? medusaProduct.options.map((o: any) => ({
      id: o.id,
      name: o.title,
      values: o.values ? o.values.map((v: any) => v.value) : []
    })) : [],
  };
};

export const commerce = {
  productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    // Fetch from Medusa
    try {
      const response = await medusaClient.products.list({ handle: idOrSlug });
      if (response.products && response.products.length > 0) {
        return mapMedusaProductToYNS(response.products[0]);
      }
      throw new Error("Product not found");
    } catch (e) {
      throw e;
    }
  },
  productReviewsBrowse: async () => {
    return { summary: { reviewCount: 0, averageRating: 0 }, reviews: [] };
  },
  productsBrowse: async () => {
    return { items: [], totalCount: 0 };
  },
  productBrowse: async (args: any) => {
    try {
      const res = await medusaClient.products.list({ limit: args?.limit || 20 });
      return {
        data: res.products.map(mapMedusaProductToYNS),
        meta: { count: res.count || res.products.length },
      };
    } catch (error) {
      console.warn("Medusa API Error (likely missing publishable API key):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  collectionBrowse: async (args: any) => {
    // Mock collection list for navigation
    return {
      data: [{ id: "col_1", name: "Featured", slug: "featured" }],
      meta: { count: 1 },
    };
  },
  legalPageBrowse: async () => {
    return { data: [] };
  },
  collectionGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    // Mock collection for now, would fetch from Medusa collections
    return {
      id: idOrSlug,
      name: idOrSlug.toUpperCase(),
      slug: idOrSlug,
      description: "",
      image: null,
      productCollections: [],
    };
  }
};

export const meGetCached = async () => {
  return {
    store: {
      name: "Medusa Store",
      subdomain: "localhost",
      settings: {
        storeDescription: "Powered by Medusa Backend",
        enabledTools: { reviews: false, restockNotifications: false }
      }
    },
    publicUrl: "http://localhost:3000"
  };
};

export function getStoreSeo() {
  return {
    storeName: "Medusa Store",
    storeDescription: "Powered by Medusa Backend",
  };
}

export function getStoreFaviconUrl() {
  return null;
}

export function getCanonicalUrl(): string {
  return "http://localhost:3000";
}

export const getSubdomainPublicUrl = () => {
  return Promise.resolve({ subdomain: null, publicUrl: getCanonicalUrl() });
};
