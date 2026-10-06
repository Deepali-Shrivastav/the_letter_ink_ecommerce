import { logger } from "./logger";
import { getCanonicalUrl as getMedusaCanonicalUrl, medusaClient } from "./medusa";
import { formatBrandOrderLookup } from "./utils";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(
	/\/$/,
	"",
);
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// Map Medusa Product to Storefront Product Shape
const mapMedusaProductToStorefront = (medusaProduct: any) => {
	return {
		id: medusaProduct.id,
		name: medusaProduct.title,
		slug: medusaProduct.handle,
		summary:
			medusaProduct.subtitle && !["NA", "N/A"].includes(medusaProduct.subtitle.trim().toUpperCase())
				? medusaProduct.subtitle
				: medusaProduct.description && !["NA", "N/A"].includes(medusaProduct.description.trim().toUpperCase())
					? medusaProduct.description.substring(0, 100)
					: null,
		content: medusaProduct.description,
		images:
			medusaProduct.images && medusaProduct.images.length > 0
				? medusaProduct.images.map((img: any) => img.url || img)
				: medusaProduct.thumbnail
					? [medusaProduct.thumbnail]
					: [],
		thumbnail: medusaProduct.thumbnail || medusaProduct.images?.[0]?.url || null,
		variants: medusaProduct.variants
			? medusaProduct.variants.map((v: any) => {
					// Find the price (favoring INR if present, or first available price in v.prices)
					const priceObj =
						v.prices && v.prices.length > 0
							? v.prices.find((p: any) => p.currency_code?.toLowerCase() === "inr") || v.prices[0]
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
						stock: null, // Untracked / bypass out-of-stock for now
						omnibusPrice: null,
						combinations: v.options
							? v.options.map((o: any) => {
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
												label: label,
											},
										},
									};
								})
							: [],
					};
				})
			: [],
		category: medusaProduct.collection
			? {
					name: medusaProduct.collection.title,
					slug: medusaProduct.collection.handle,
				}
			: null,
		galleryCategory: (medusaProduct.metadata?.gallery_category as string) ?? null,
		badge: (medusaProduct.metadata?.badge as string) ?? null,
		metadata: medusaProduct.metadata || {},
		seo: {
			title: medusaProduct.title,
			description: medusaProduct.description?.substring(0, 150),
		},
		type: "standard", // Not a bundle
		options: medusaProduct.options
			? medusaProduct.options.map((o: any) => ({
					id: o.id,
					name: o.title,
					values: o.values ? o.values.map((v: any) => v.value) : [],
				}))
			: [],
	};
};

const mapMedusaCartToStorefront = (medusaCart: any) => {
	return {
		id: medusaCart.id,
		promotions:
			medusaCart.promotions?.map((p: any) => ({
				id: p.id,
				code: p.code,
				isAutomatic: p.is_automatic,
				type: p.type,
			})) || [],
		discountTotal: medusaCart.discount_total || 0,
		lineItems: medusaCart.items
			? medusaCart.items.map((item: any) => {
					const priceVal = String(item.metadata?.custom_unit_price ?? item.unit_price);
					return {
						id: item.id,
						quantity: item.quantity,
						metadata: item.metadata || {},
						discountTotal: item.discount_total || 0,
						originalPrice: item.unit_price,
						adjustments: item.adjustments || [],
						productVariant: {
							id: item.variant_id || item.metadata?.custom_variant_id || item.id,
							price: priceVal,
							priceGross: priceVal,
							images: item.metadata?.preview_image
								? [item.metadata.preview_image]
								: item.thumbnail
									? [item.thumbnail]
									: item.metadata?.image
										? [item.metadata.image]
										: [],
							product: {
								id:
									item.variant?.product_id || item.product_id || item.metadata?.custom_variant_id || item.id,
								name: item.title || item.product_title || item.metadata?.title || "Product",
								slug:
									item.variant?.product?.handle || item.product_handle || item.metadata?.slug || "workshops",
								images: item.metadata?.preview_image
									? [item.metadata.preview_image]
									: item.thumbnail
										? [item.thumbnail]
										: item.metadata?.image
											? [item.metadata.image]
											: [],
								type: "standard",
							},
						},
					};
				})
			: [],
		subtotal: medusaCart.subtotal,
		subtotalNet: medusaCart.subtotal,
		subtotalGross: medusaCart.total,
	};
};

// Order caching removed (SEC-014) to prevent memory leaks and lost data on serverless restarts.
// We now rely exclusively on the Medusa tracking API as the single source of truth.
export const storeRecentOrder = (_order: any) => {
	// No-op to preserve function signature for existing callers
};

export const mapMedusaOrderToStorefront = (medusaOrder: any) => {
	if (!medusaOrder) return null;
	if (medusaOrder.orderData) return medusaOrder;

	const items = medusaOrder.items || [];
	const shippingAddress = medusaOrder.shipping_address;
	const fullName = [shippingAddress?.first_name, shippingAddress?.last_name].filter(Boolean).join(" ").trim();

	return {
		id: medusaOrder.id,
		display_id: medusaOrder.display_id,
		status: medusaOrder.status,
		fulfillment_status: medusaOrder.fulfillment_status,
		payment_status: medusaOrder.payment_status,
		created_at: medusaOrder.created_at,
		fulfillments: medusaOrder.fulfillments || [],
		lookup: formatBrandOrderLookup(medusaOrder.id, medusaOrder.display_id),
		orderData: {
			lineItems: items.map((item: any) => {
				const priceVal = String(item.metadata?.custom_unit_price ?? item.unit_price ?? 0);
				return {
					id: item.id,
					quantity: item.quantity || 1,
					discountTotal: item.discount_total || 0,
					originalPrice: item.unit_price || 0,
					productVariant: {
						id: item.variant_id || item.id,
						price: priceVal,
						priceGross: priceVal,
						images: item.metadata?.preview_image
							? [item.metadata.preview_image]
							: item.thumbnail
								? [item.thumbnail]
								: [],
						product: {
							id: item.variant?.product_id || item.product_id || item.id,
							name: item.title || item.product_title || "Atelier Creation",
							slug: item.variant?.product?.handle || item.product_handle || "product",
							images: item.metadata?.preview_image
								? [item.metadata.preview_image]
								: item.thumbnail
									? [item.thumbnail]
									: [],
							type: "standard",
						},
					},
				};
			}),
			subtotal: medusaOrder.subtotal ?? medusaOrder.total ?? 0,
			subtotalNet: medusaOrder.subtotal ?? medusaOrder.total ?? 0,
			subtotalGross: medusaOrder.total ?? 0,
			total: medusaOrder.total ?? 0,
			totalTax: medusaOrder.tax_total ?? 0,
			shipping: {
				name: medusaOrder.shipping_methods?.[0]?.name || "Standard Delivery (India)",
				price: medusaOrder.shipping_total || 0,
				priceGross: medusaOrder.shipping_total || 0,
			},
			shippingAddress: shippingAddress
				? {
						name: fullName || "Valued Patron",
						line1: shippingAddress.address_1,
						line2: shippingAddress.address_2,
						city: shippingAddress.city,
						state: shippingAddress.province,
						postalCode: shippingAddress.postal_code,
						country: shippingAddress.country_code ? shippingAddress.country_code.toUpperCase() : "IN",
						phone: shippingAddress.phone || "",
					}
				: null,
			customer: {
				email: medusaOrder.email || medusaOrder.customer?.email || "",
				phone: shippingAddress?.phone || medusaOrder.customer?.phone || "",
			},
		},
	};
};

export const commerce = {
	productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const fields = "*variants.prices,*variants.options,*images,*categories,*collection,+metadata";
		// Try handle first
		try {
			const response = await medusaClient.products.list({
				handle: idOrSlug,
				fields,
			} as any);

			if (response.products && response.products.length > 0) {
				return mapMedusaProductToStorefront(response.products[0]);
			}
		} catch (error: any) {
			logger.warn("Medusa API Error (productGet by handle):", error?.message || String(error));
		}

		// Try by ID
		try {
			const idRes = await medusaClient.products.retrieve(idOrSlug, { fields } as any);
			if (idRes.product) {
				return mapMedusaProductToStorefront(idRes.product);
			}
		} catch {}

		// Try Workshop handle/ID fallback
		try {
			const headers: Record<string, string> = {};
			if (PUBLISHABLE_KEY) {
				headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
			}
			const wsRes = await fetch(`${BACKEND_URL}/store/workshops`, {
				headers,
				cache: "no-store",
				signal: AbortSignal.timeout(8000),
			});
			if (wsRes.ok) {
				const json = await wsRes.json();
				const workshop = (json.workshops || []).find((w: any) => w.handle === idOrSlug || w.id === idOrSlug);
				if (workshop) {
					return {
						id: workshop.id,
						name: workshop.title,
						slug: workshop.handle,
						summary: workshop.description || workshop.spots_text || "Interactive Workshop",
						content:
							workshop.description ||
							`Date: ${workshop.date}, Time: ${workshop.time}, Venue: ${workshop.venue}\n${workshop.kit_info || ""}`,
						images: workshop.images || [],
						variants: [
							{
								id: workshop.id,
								name: "Standard Ticket",
								price: String(workshop.price || 0),
								originalPrice: String(workshop.price || 0),
								currency: "INR",
								images: [],
								sku: workshop.id,
								stock: null,
								omnibusPrice: null,
								combinations: [],
							},
						],
						category: { name: "Workshops", slug: "workshops" },
						galleryCategory: null,
						badge: "Workshop",
						metadata: {
							is_workshop: true,
							date: workshop.date,
							time: workshop.time,
							venue: workshop.venue,
							level: workshop.level,
						},
						seo: {
							title: workshop.title,
							description: workshop.description,
						},
						type: "standard",
						options: [],
					};
				}
			}
		} catch (e) {
			logger.warn("Workshop fallback in productGet failed:", e);
		}

		throw new Error("Product not found");
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
				fields: "*variants.prices,*variants.options,*images,*categories,*collection,+metadata",
			};
			if (args?.query || args?.q) params.q = args.query || args.q;
			if (args?.collectionId)
				params.collection_id = Array.isArray(args.collectionId) ? args.collectionId : [args.collectionId];
			if (args?.categoryId)
				params.category_id = Array.isArray(args.categoryId) ? args.categoryId : [args.categoryId];

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
		} catch (error: any) {
			logger.warn("Medusa API Error (productBrowse):", error?.message || String(error));
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
					p.title?.toLowerCase().includes("masterclass"),
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

			let minPrice = Number.POSITIVE_INFINITY;
			let maxPrice = 0;
			const prices: number[] = [];

			for (const p of productsRes.products || []) {
				for (const v of p.variants || []) {
					for (const price of v.prices || []) {
						const amt = Number(price.amount);
						if (!Number.isNaN(amt)) {
							if (amt < minPrice) minPrice = amt;
							if (amt > maxPrice) maxPrice = amt;
							prices.push(amt);
						}
					}
				}
			}

			if (minPrice === Number.POSITIVE_INFINITY) minPrice = 0;

			const BUCKETS = 12;
			const priceDistribution = new Array(BUCKETS).fill(0);
			if (maxPrice > minPrice && prices.length > 0) {
				const bucketSize = (maxPrice - minPrice) / BUCKETS;
				for (const p of prices) {
					let bucketIndex = Math.floor((p - minPrice) / bucketSize);
					if (bucketIndex >= BUCKETS) bucketIndex = BUCKETS - 1;
					priceDistribution[bucketIndex]++;
				}
			}

			return {
				priceBounds: { min: minPrice, max: maxPrice },
				priceDistribution,
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
		} catch (error: any) {
			logger.warn("Medusa API Error (productFilters):", error?.message || String(error));
			return {
				priceBounds: { min: 0, max: 0 },
				priceDistribution: [],
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
		} catch (error: any) {
			logger.warn("Medusa API Error (categoriesBrowse):", error?.message || String(error));
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
		} catch (error: any) {
			logger.warn("Medusa API Error (search):", error?.message || String(error));
			return { items: [], totalCount: 0 };
		}
	},
	cartGet: async ({ cartId }: { cartId: string }) => {
		"use cache";
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
	cartUpsert: async ({
		cartId,
		variantId,
		quantity,
		mode,
		metadata,
		unit_price,
	}: {
		cartId?: string;
		variantId: string;
		quantity: number;
		mode?: "set";
		metadata?: Record<string, any>;
		unit_price?: number;
	}) => {
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

			const existingLineItem = cart.items?.find(
				(item: any) =>
					item.variant_id === variantId ||
					item.metadata?.custom_variant_id === variantId ||
					item.id === variantId,
			);

			const itemMetadata = {
				...(metadata || {}),
				custom_variant_id: variantId,
				...(unit_price !== undefined ? { custom_unit_price: unit_price } : {}),
			};

			const createPayload: any = {
				variant_id: variantId,
				quantity,
				metadata: itemMetadata,
			};
			const updatePayload: any = {
				metadata: itemMetadata,
			};

			if (quantity === 0 && existingLineItem) {
				await medusaClient.carts.lineItems.delete(activeCartId!, existingLineItem.id);
			} else if (existingLineItem) {
				updatePayload.quantity = mode === "set" ? quantity : existingLineItem.quantity + quantity;
				await medusaClient.carts.lineItems.update(activeCartId!, existingLineItem.id, updatePayload);
			} else if (quantity > 0) {
				if (unit_price !== undefined || variantId.startsWith("wk_")) {
					await medusaClient.client.request("POST", `/store/carts/${activeCartId}/line-items/custom`, {
						variant_id: variantId,
						title: metadata?.title || metadata?.name || "Workshop Seat",
						quantity,
						metadata: itemMetadata,
						unit_price: unit_price ?? (metadata?.raw_price || 4500),
					});
				} else {
					await medusaClient.carts.lineItems.create(activeCartId!, createPayload);
				}
			}

			const { cart: updatedCart } = await medusaClient.carts.retrieve(activeCartId!);
			return mapMedusaCartToStorefront(updatedCart);
		} catch (error: any) {
			logger.error("cartUpsert error:", error);
			throw new Error(error?.message || "Cart operation failed");
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
		} catch (error: any) {
			logger.warn("Medusa API Error (collections):", error?.message || String(error));
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
	studioVideosBrowse: async (category?: string) => {
		try {
			const headers: Record<string, string> = {};
			if (PUBLISHABLE_KEY) {
				headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
			}
			const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
			const res = await fetch(`${BACKEND_URL}/store/blog-videos${query}`, {
				headers,
				cache: "no-store",
				signal: AbortSignal.timeout(8000),
			});
			if (res.ok) {
				const json = await res.json();
				return { data: json.videos || [] };
			}
		} catch (e) {
			logger.warn("studioVideosBrowse error:", e);
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
			const cleanId = (id || "").trim();
			const _lowerId = cleanId.toLowerCase();
			const _noHash = cleanId.replace(/^#/, "");

			// Query Medusa tracking API endpoint
			try {
				const headers: Record<string, string> = { "Content-Type": "application/json" };
				if (PUBLISHABLE_KEY) headers["x-publishable-api-key"] = PUBLISHABLE_KEY;

				const trackRes = await fetch(`${BACKEND_URL}/store/orders/track`, {
					method: "POST",
					headers,
					body: JSON.stringify({ reference: cleanId }),
					cache: "no-store",
				});

				if (trackRes.ok) {
					const json = await trackRes.json();
					if (json.order) {
						const mapped = mapMedusaOrderToStorefront(json.order);
						storeRecentOrder(mapped);
						return mapped;
					}
				}
			} catch {}

			// Fallback: direct retrieve
			try {
				const res = await medusaClient.orders.retrieve(cleanId);
				if (res?.order) {
					const mapped = mapMedusaOrderToStorefront(res.order);
					storeRecentOrder(mapped);
					return mapped;
				}
			} catch {}

			return null;
		} catch (_e) {
			return null;
		}
	},
	collectionGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		try {
			const res = await medusaClient.collections.list({ handle: [idOrSlug] });
			const col = res.collections?.[0];
			if (!col) return null;

			return {
				id: col.id,
				name: col.title,
				slug: col.handle,
				description: col.metadata?.description || "",
				image: col.metadata?.image || null,
				productCollections: [],
			};
		} catch (error) {
			logger.warn("Medusa API (collectionGet):", error);
			return null;
		}
	},
	categoryGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		try {
			if (idOrSlug === "workshops") {
				return {
					id: "cat_workshops",
					name: "Workshops",
					slug: "workshops",
					description: "Artisanal Calligraphy Masterclasses & Studio Workshops",
					image: null,
					active: true,
				};
			}

			const res = await medusaClient.productCategories.list({ handle: idOrSlug });
			const cat = res.product_categories?.[0];
			if (!cat) return null;

			return {
				id: cat.id,
				name: cat.name,
				slug: cat.handle,
				description: cat.description || "",
				image: null,
				active: true,
			};
		} catch (error) {
			logger.warn("Medusa API (categoryGet):", error);
			return null;
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
	request: async <T = any>(
		path: string,
		options?: Omit<RequestInit, "body"> & { body?: any },
	): Promise<T> => {
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
			const errText = await res.text().catch(() => "");
			throw new Error(`Medusa request to ${path} failed with status ${res.status}: ${errText}`);
		}
		return res.json();
	},
	cartApplyPromotion: async ({ cartId, promoCode }: { cartId: string; promoCode: string }) => {
		try {
			const code = (promoCode || "").trim().toUpperCase();
			const res = await commerce.request(`/store/carts/${cartId}/promotions`, {
				method: "POST",
				body: { promo_codes: [code] },
			});
			return mapMedusaCartToStorefront(res.cart);
		} catch (error: any) {
			logger.error("cartApplyPromotion error:", error);
			throw new Error(error?.message || "Failed to apply promotion");
		}
	},
	cartRemovePromotion: async ({ cartId, promoCode }: { cartId: string; promoCode: string }) => {
		try {
			const code = (promoCode || "").trim().toUpperCase();
			const res = await commerce.request(`/store/carts/${cartId}/promotions`, {
				method: "DELETE",
				body: { promo_codes: [code] },
			});
			return mapMedusaCartToStorefront(res.cart);
		} catch (error: any) {
			logger.error("cartRemovePromotion error:", error);
			throw new Error(error?.message || "Failed to remove promotion");
		}
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
				enabledTools: { reviews: false, restockNotifications: false },
			},
		},
		publicUrl: getCanonicalUrl(),
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
