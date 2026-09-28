import { addToCart } from "./app/cart/actions";
import { getCartCookieJson } from "./app/cart/cookies";
import { commerce } from "./lib/commerce";

async function run() {
  const variantId = "variant_123"; // I need the actual variant ID
  // But wait, it's easier to just call addToCart with a dummy ID to see if it reaches the backend, 
  // or fetch a variant first.
  const res = await commerce.productBrowse({});
  if (!res.data) return console.log("No products array");
  const product = res.data.find((p: any) => p.name === "Handwritten Letters");
  if (!product) return console.log("Product not found");
  const variant = product.variants[0];
  console.log("Variant ID:", variant.id);
  
  console.log("Attempting to add to cart...");
  try {
      const result = await commerce.cartUpsert({ 
          variantId: variant.id, 
          quantity: 1, 
          metadata: { 
              customization_selections: { "Ink Color": "White", "Paper Color": "Yellowish" },
              customization_price_adjustment: 0
          },
          unit_price: 1500
      });
      console.log("Success:", result);
  } catch(e) {
      console.log("Error adding to cart:");
      console.error(e.response ? e.response.data : e);
  }
}

run();
