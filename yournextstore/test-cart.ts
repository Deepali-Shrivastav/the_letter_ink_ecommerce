import { commerce } from "./lib/commerce";

async function run() {
  console.log("Testing cartUpsert to create a new cart...");
  try {
    const products = await commerce.productBrowse({ limit: 1 });
    if (!products.data.length) {
      console.log("No products found.");
      return;
    }
    
    const variantId = products.data[0].variants[0].id;
    console.log("Adding variant to cart:", variantId);

    const cart = await commerce.cartUpsert({
      variantId,
      quantity: 1
    });

    console.log("Cart created successfully:", JSON.stringify(cart, null, 2));
    
    console.log("Testing cartGet with ID:", cart.id);
    const fetchedCart = await commerce.cartGet({ cartId: cart.id });
    console.log("Cart fetched successfully:", fetchedCart.id);
  } catch (error) {
    console.error("Cart test failed:", error);
  }
}

run();
