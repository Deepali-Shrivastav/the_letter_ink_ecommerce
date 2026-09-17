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
      // Find the price (favoring INR if present, or first available price in v.prices)
      const priceObj = (v.prices && v.prices.length > 0)
        ? (v.prices.find((p: any) => p.currency_code?.toLowerCase() === "inr") || v.prices[0])
        : null;

      const priceStr = priceObj ? String(priceObj.amount) : "1500";
      const currencyStr = (priceObj?.currency_code || "inr").toUpperCase();
      
      return {
        id: v.id,
        name: v.title,
        price: priceStr,
        originalPrice: priceStr,
        currency: currencyStr,
        images: [],
        sku: v.sku || null,
        stock: v.inventory_quantity ?? 100,
        omnibusPrice: null,
        combinations: v.options ? v.options.map((o: any) => {
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
    galleryCategory: (medusaProduct.metadata?.gallery_category as string) ?? null,
    badge: (medusaProduct.metadata?.badge as string) ?? null,
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

const mapMedusaCartToYNS = (medusaCart: any) => {
  return {
    id: medusaCart.id,
    lineItems: medusaCart.items ? medusaCart.items.map((item: any) => ({
      quantity: item.quantity,
      productVariant: {
        id: item.variant_id,
        price: String(item.unit_price),
        priceGross: String(item.unit_price),
        images: item.thumbnail ? [item.thumbnail] : [],
        product: {
          id: item.variant?.product_id || item.id,
          name: item.title,
          slug: item.variant?.product?.handle || "product",
          images: item.thumbnail ? [item.thumbnail] : [],
          type: "standard"
        }
      }
    })) : [],
    subtotal: medusaCart.subtotal,
    subtotalNet: medusaCart.subtotal,
    subtotalGross: medusaCart.total,
  };
};

export const commerce = {
  productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    try {
      const response = await medusaClient.products.list({
        handle: idOrSlug,
        fields: "*variants.prices,*variants.options,*images,*categories,*collection"
      } as any);

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
      const params: any = {
        limit: args?.limit || 20,
        fields: "*variants.prices,*variants.options,*images,*categories,*collection"
      };
      if (args?.collectionId) params.collection_id = [args.collectionId];
      if (args?.categoryId) params.category_id = [args.categoryId];
      
      const res = await medusaClient.products.list(params);
      return {
        data: res.products.map(mapMedusaProductToYNS),
        meta: { count: res.count || res.products.length },
      };
    } catch (error) {
      console.warn("Medusa API Error (productBrowse):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  cartGet: async ({ cartId }: { cartId: string }) => {
    try {
      const { cart } = await medusaClient.carts.retrieve(cartId);
      return mapMedusaCartToYNS(cart);
    } catch (error) {
      console.error("cartGet error:", error);
      throw new Error("Cart not found");
    }
  },
  cartUpsert: async ({ cartId, variantId, quantity, mode }: { cartId?: string, variantId: string, quantity: number, mode?: "set" }) => {
    try {
      let activeCartId = cartId;
      
      // 1. Create cart if none exists
      if (!activeCartId) {
        const { cart } = await medusaClient.carts.create({});
        activeCartId = cart.id;
      }

      // 2. Retrieve current cart to find line item by variantId
      let { cart } = await medusaClient.carts.retrieve(activeCartId!);
      const existingLineItem = cart.items?.find((item: any) => item.variant_id === variantId);

      // 3. Delete, Update, or Add Line Item
      if (quantity === 0 && existingLineItem) {
        await medusaClient.carts.lineItems.delete(activeCartId!, existingLineItem.id);
      } else if (existingLineItem) {
        const newQuantity = mode === "set" ? quantity : existingLineItem.quantity + quantity;
        await medusaClient.carts.lineItems.update(activeCartId!, existingLineItem.id, { quantity: newQuantity });
      } else if (quantity > 0) {
        await medusaClient.carts.lineItems.create(activeCartId!, { variant_id: variantId, quantity });
      }

      // 4. Return updated cart
      const { cart: updatedCart } = await medusaClient.carts.retrieve(activeCartId!);
      return mapMedusaCartToYNS(updatedCart);
    } catch (error) {
      console.error("cartUpsert error:", error);
      throw error;
    }
  },
  collectionBrowse: async (args?: { limit?: number }) => {
    try {
      const res = await medusaClient.collections.list({ limit: args?.limit || 20 });
      return {
        data: res.collections.map((col: any) => ({
          id: col.id,
          name: col.title,
          slug: col.handle,
          description: col.metadata?.description || "",
          image: col.metadata?.image || null
        })),
        meta: { count: res.count || res.collections.length },
      };
    } catch (error) {
      console.error("Medusa API Error (collections):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  legalPageBrowse: async () => {
    return { data: [] };
  },
  collectionGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    try {
      const res = await medusaClient.collections.list({ handle: [idOrSlug] });
      const col = res.collections?.[0];
      if (!col) throw new Error("Collection not found");
      
      return {
        id: col.id,
        name: col.title,
        slug: col.handle,
        description: col.metadata?.description || "",
        image: col.metadata?.image || null,
        productCollections: []
      };
    } catch (error) {
      console.error("Medusa API Error (collectionGet):", error);
      throw error;
    }
  },
  categoryGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    try {
      const res = await medusaClient.productCategories.list({ handle: idOrSlug });
      const cat = res.product_categories?.[0];
      if (!cat) throw new Error("Category not found");
      
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.handle,
        description: cat.description || "",
        image: null
      };
    } catch (error) {
      console.error("Medusa API Error (categoryGet):", error);
      throw error;
    }
  }
};

export const meGetCached = async () => {
  return {
    store: {
      name: "The Letter Ink",
      currency: "INR",
      locale: "en-IN",
      taxBehavior: "inclusive",
      subdomain: "localhost",
      settings: {
        storeDescription: "The Letter Ink — Artisanal calligraphy studio & bespoke stationery",
        enabledTools: { reviews: false, restockNotifications: false }
      }
    },
    publicUrl: "http://localhost:3000"
  };
};

export function getStoreSeo() {
  return {
    storeName: "The Letter Ink",
    storeDescription: "The Letter Ink — Artisanal calligraphy studio & bespoke stationery",
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
