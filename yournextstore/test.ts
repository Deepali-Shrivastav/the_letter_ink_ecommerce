import { medusaClient } from "./lib/medusa";

const mapMedusaProductToYNS = (medusaProduct: any) => {
  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    slug: medusaProduct.handle,
    summary: medusaProduct.subtitle || medusaProduct.description?.substring(0, 100),
    content: medusaProduct.description,
    images: medusaProduct.images ? medusaProduct.images.map((img: any) => img.url) : [medusaProduct.thumbnail],
    variants: medusaProduct.variants ? medusaProduct.variants.map((v: any) => ({
      id: v.id,
      name: v.title,
      price: v.prices ? v.prices[0]?.amount / 100 : 0, // Simplified price
      currency: v.prices ? v.prices[0]?.currency_code : "usd",
      images: [],
      options: v.options ? v.options.map((o: any) => ({ name: o.value, value: o.value })) : [],
      sku: v.sku,
      inventoryQuantity: v.inventory_quantity
    })) : [],
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
      values: o.values.map((v: any) => v.value)
    })) : [],
  };
};

async function test() {
  try {
    const response = await medusaClient.products.list({ handle: "sweatshirt" });
    if (response.products && response.products.length > 0) {
      console.log("Found product!");
      const mapped = mapMedusaProductToYNS(response.products[0]);
      console.log("Mapped successfully!");
      console.log(mapped);
    } else {
      console.log("No product found");
    }
  } catch (e: any) {
    console.error("Error:", e.message);
    if (e.stack) console.error(e.stack);
  }
}

test();
