import { medusaClient, getCanonicalUrl as getMedusaCanonicalUrl } from "./medusa";
import { cacheLife } from "next/cache";
import { logger } from "./logger";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "");
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// Map Medusa Product to Storefront Product Shape
const mapMedusaProductToStorefront = (medusaProduct: any) => {
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

      const priceStr = priceObj ? String(priceObj.amount) : "0";
      const currencyStr = (priceObj?.currency_code || "inr").toUpperCase();
      
      return {
        id: v.id,
        name: v.title,
        price: priceStr,
        originalPrice: priceStr,
        currency: currencyStr,
        images: [],
        sku: v.sku || null,
        stock: v.inventory_quantity ?? 0,
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
    metadata: medusaProduct.metadata || {},
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

const mapMedusaCartToStorefront = (medusaCart: any) => {
  return {
    id: medusaCart.id,
    lineItems: medusaCart.items ? medusaCart.items.map((item: any) => {
      const priceVal = String(item.metadata?.custom_unit_price ?? item.unit_price);
      return {
        id: item.id,
        quantity: item.quantity,
        metadata: item.metadata || {},
        productVariant: {
          id: item.variant_id,
          price: priceVal,
          priceGross: priceVal,
          images: item.metadata?.preview_image ? [item.metadata.preview_image] : (item.thumbnail ? [item.thumbnail] : []),
          product: {
            id: item.variant?.product_id || item.product_id || item.id,
            name: item.title || item.product_title || "Product",
            slug: item.variant?.product?.handle || item.product_handle || "product",
            images: item.metadata?.preview_image ? [item.metadata.preview_image] : (item.thumbnail ? [item.thumbnail] : []),
            type: "standard"
          }
        }
      };
    }) : [],
    subtotal: medusaCart.subtotal,
    subtotalNet: medusaCart.subtotal,
    subtotalGross: medusaCart.total,
  };
};

export const commerce = {
  productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    try {
      const fields = "*variants.prices,*variants.options,*images,*categories,*collection";
      // Try handle first
      const response = await medusaClient.products.list({
        handle: idOrSlug,
        fields,
      } as any);

      if (response.products && response.products.length > 0) {
        return mapMedusaProductToStorefront(response.products[0]);
      }

      // Try by ID
      try {
        const idRes = await medusaClient.products.retrieve(idOrSlug, { fields } as any);
        if (idRes.product) {
          return mapMedusaProductToStorefront(idRes.product);
        }
      } catch {}

      throw new Error("Product not found");
    } catch (e) {
      throw e;
    }
  },
  productReviewsBrowse: async () => {
    return { summary: { reviewCount: 0, averageRating: 0 }, reviews: [] };
  },
  productsBrowse: async (args?: any) => {
    const res = await commerce.productBrowse(args);
    return { items: res.data, totalCount: res.meta.count };
  },
  productBrowse: async (args: any) => {
    try {
      const params: any = {
        limit: args?.limit || 20,
        offset: args?.offset || 0,
        fields: "*variants.prices,*variants.options,*images,*categories,*collection"
      };
      if (args?.query || args?.q) params.q = args.query || args.q;
      if (args?.collectionId) params.collection_id = Array.isArray(args.collectionId) ? args.collectionId : [args.collectionId];
      if (args?.categoryId) params.category_id = Array.isArray(args.categoryId) ? args.categoryId : [args.categoryId];

      const res = await medusaClient.products.list(params);

      // Filter out workshops so product browse contains ONLY physical products
      const physicalProducts = res.products.filter((p: any) => {
        const isWorkshop =
          p.metadata?.is_workshop === true ||
          p.metadata?.is_workshop === "true" ||
          p.handle?.includes("workshop") ||
          p.title?.toLowerCase().includes("masterclass") ||
          p.collection?.handle === "workshops";
        return !isWorkshop;
      });

      return {
        data: physicalProducts.map(mapMedusaProductToStorefront),
        meta: { count: physicalProducts.length },
      };
    } catch (error) {
      logger.warn("Medusa API Error (productBrowse):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  workshopBrowse: async () => {
    // 1. Try custom Workshop Module endpoint
    try {
      const headers: Record<string, string> = {};
      if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
      }
      const res = await fetch(`${BACKEND_URL}/store/workshops`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.workshops && json.workshops.length > 0) {
          return json.workshops;
        }
      }
    } catch (e) {
      logger.warn("Workshop Module endpoint fallback trigger:", e);
    }

    // 2. Fallback to product list with is_workshop metadata
    try {
      const res = await medusaClient.products.list({
        limit: 100,
        fields: "*variants.prices,*variants.options,*images,*categories,*collection",
      });
      const workshopProducts = res.products.filter(
        (p: any) =>
          p.metadata?.is_workshop === true ||
          p.metadata?.is_workshop === "true" ||
          p.handle?.includes("workshop") ||
          p.title?.toLowerCase().includes("masterclass")
      );
      return workshopProducts.map((p: any) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        description: p.description || "",
        date: p.metadata?.date || "",
        time: p.metadata?.time || "",
        venue: p.metadata?.venue || "",
        level: p.metadata?.level || "",
        price: p.variants?.[0]?.prices?.[0]?.amount || 0,
        spots_text: p.metadata?.spotsText || "",
        kit_info: p.metadata?.kitInfo || "",
        images: p.images?.map((img: any) => img.url) || (p.thumbnail ? [p.thumbnail] : []),
        status: "published",
      }));
    } catch (err) {
      logger.error("workshopBrowse fallback error:", err);
      return [];
    }
  },
  productFilters: async () => {
    try {
      const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
        medusaClient.products.list({ limit: 100, fields: "*variants.prices" }),
        medusaClient.productCategories.list({ limit: 50 }).catch(() => ({ product_categories: [] })),
        medusaClient.collections.list({ limit: 50 }).catch(() => ({ collections: [] })),
      ]);

      let minPrice = Infinity;
      let maxPrice = 0;

      for (const p of productsRes.products || []) {
        for (const v of p.variants || []) {
          for (const price of v.prices || []) {
            const amt = Number(price.amount);
            if (!isNaN(amt)) {
              if (amt < minPrice) minPrice = amt;
              if (amt > maxPrice) maxPrice = amt;
            }
          }
        }
      }

      if (minPrice === Infinity) minPrice = 0;

      return {
        priceBounds: { min: minPrice, max: maxPrice },
        variantTypes: [],
        categories: (categoriesRes.product_categories || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.handle,
        })),
        collections: (collectionsRes.collections || []).map((col: any) => ({
          id: col.id,
          name: col.title,
          slug: col.handle,
        })),
        brands: [],
      };
    } catch (error) {
      logger.error("Medusa API Error (productFilters):", error);
      return {
        priceBounds: { min: 0, max: 0 },
        variantTypes: [],
        categories: [],
        collections: [],
        brands: [],
      };
    }
  },
  categoriesBrowse: async (args?: { active?: boolean; limit?: number }) => {
    try {
      const res = await medusaClient.productCategories.list({ limit: args?.limit || 50 });
      return {
        data: (res.product_categories || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.handle,
          description: cat.description || "",
          parentId: cat.parent_category_id || null,
          image: null,
          active: true,
        })),
        meta: { count: res.count || res.product_categories?.length || 0 },
      };
    } catch (error) {
      logger.error("Medusa API Error (categoriesBrowse):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  search: async ({ query, limit = 6 }: { query: string; limit?: number }) => {
    try {
      const res = await medusaClient.products.list({
        q: query,
        limit,
        fields: "*variants.prices,*variants.options,*images,*categories,*collection",
      });
      const mapped = res.products.map(mapMedusaProductToStorefront);
      return {
        items: mapped.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: p.images[0] || null,
          summary: p.summary || null,
        })),
        totalCount: res.count || res.products.length,
      };
    } catch (error) {
      logger.error("Medusa API Error (search):", error);
      return { items: [], totalCount: 0 };
    }
  },
  cartGet: async ({ cartId }: { cartId: string }) => {
    try {
      const { cart } = await medusaClient.carts.retrieve(cartId);
      if (cart && (cart as any).currency_code && (cart as any).currency_code.toLowerCase() !== "inr") {
        return null;
      }
      return mapMedusaCartToStorefront(cart);
    } catch (error) {
      logger.error("cartGet error:", error);
      throw new Error("Cart not found");
    }
  },
  cartUpsert: async ({ cartId, variantId, quantity, mode, metadata, unit_price }: { cartId?: string; variantId: string; quantity: number; mode?: "set"; metadata?: Record<string, any>; unit_price?: number }) => {
    try {
      let activeCartId = cartId;

      if (!activeCartId) {
        const { cart } = await medusaClient.carts.create({});
        activeCartId = cart.id;
      }

      let { cart } = await medusaClient.carts.retrieve(activeCartId!);
      if (cart && (cart as any).currency_code && (cart as any).currency_code.toLowerCase() !== "inr") {
        const { cart: newCart } = await medusaClient.carts.create({});
        activeCartId = newCart.id;
        cart = newCart;
      }

      const existingLineItem = cart.items?.find((item: any) => item.variant_id === variantId);

      const itemMetadata = {
        ...(metadata || {}),
        ...(unit_price !== undefined ? { custom_unit_price: unit_price } : {})
      };

      const createPayload: any = { variant_id: variantId, quantity, metadata: itemMetadata };
      const updatePayload: any = { metadata: itemMetadata };

      if (quantity === 0 && existingLineItem) {
        await medusaClient.carts.lineItems.delete(activeCartId!, existingLineItem.id);
      } else if (existingLineItem) {
        updatePayload.quantity = mode === "set" ? quantity : existingLineItem.quantity + quantity;
        await medusaClient.carts.lineItems.update(activeCartId!, existingLineItem.id, updatePayload);
      } else if (quantity > 0) {
        await medusaClient.carts.lineItems.create(activeCartId!, createPayload);
      }

      const { cart: updatedCart } = await medusaClient.carts.retrieve(activeCartId!);
      return mapMedusaCartToStorefront(updatedCart);
    } catch (error) {
      logger.error("cartUpsert error:", error);
      throw error;
    }
  },
  collectionBrowse: async (args?: { active?: boolean; limit?: number }) => {
    try {
      const res = await medusaClient.collections.list({ limit: args?.limit || 20 });
      return {
        data: res.collections.map((col: any) => ({
          id: col.id,
          name: col.title,
          slug: col.handle,
          description: col.metadata?.description || "",
          image: col.metadata?.image || null,
        })),
        meta: { count: res.count || res.collections.length },
      };
    } catch (error) {
      logger.error("Medusa API Error (collections):", error);
      return { data: [], meta: { count: 0 } };
    }
  },
  postBrowse: async () => {
    try {
      const headers: Record<string, string> = {};
      if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
      }
      const res = await fetch(`${BACKEND_URL}/store/blogs`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        return { data: json.blogs || [] };
      }
    } catch (e) {
      logger.warn("postBrowse error:", e);
    }
    return { data: [] };
  },
  postGet: async ({ idOrSlug }: { idOrSlug: string }) => {
    try {
      const headers: Record<string, string> = {};
      if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
      }
      const res = await fetch(`${BACKEND_URL}/store/blogs/${encodeURIComponent(idOrSlug)}`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        return json.blog || null;
      }
    } catch (e) {
      logger.warn("postGet error:", e);
    }
    return null;
  },
  orderGet: async ({ id }: { id: string }) => {
    try {
      const res = await medusaClient.orders.retrieve(id);
      return res.order;
    } catch (e) {
      return null;
    }
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
        productCollections: [],
      };
    } catch (error) {
      logger.error("Medusa API Error (collectionGet):", error);
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
        image: null,
        active: true,
      };
    } catch (error) {
      logger.error("Medusa API Error (categoryGet):", error);
      throw error;
    }
  },
  subscriberCreate: async (_data: { email: string; marketingConsent?: boolean }) => {
    return { success: true };
  },
  contactMessageCreate: async (_data: { email: string; message: string }) => {
    return { success: true };
  },
  productReviewCreate: async (
    _target: { idOrSlug: string },
    _review: { author: string; email: string; content: string; rating: number },
  ) => {
    return { success: true };
  },
  cartAddBundle: async (_args: any) => {
    return null;
  },
  request: async <T = any>(path: string, options?: Omit<RequestInit, "body"> & { body?: any }): Promise<T> => {
    const url = `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };
    if (PUBLISHABLE_KEY) {
      headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
    }
    const res = await fetch(url, {
      ...options,
      headers,
      body: options?.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options?.body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Medusa request to ${path} failed with status ${res.status}`);
    }
    return res.json();
  },
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
    publicUrl: getCanonicalUrl()
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
  return getMedusaCanonicalUrl();
}

export const getSubdomainPublicUrl = () => {
  return Promise.resolve({ subdomain: null, publicUrl: getCanonicalUrl() });
};
