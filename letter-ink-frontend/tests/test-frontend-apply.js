require("dotenv").config({ path: ".env.local" });
const { commerce } = require("./lib/commerce");

async function testFrontendApply() {
  const headers = {
    'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    'Content-Type': 'application/json'
  };

  const createCartRes = await fetch('http://localhost:9000/store/carts', {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
  const cartData = await createCartRes.json();
  const cartId = cartData.cart.id;

  const prodRes = await fetch('http://localhost:9000/store/products?handle=handwritten-letters', { headers });
  const prodData = await prodRes.json();
  const variantId = prodData.products[0].variants[0].id;

  await fetch(`http://localhost:9000/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ variant_id: variantId, quantity: 1 })
  });

  console.log("Applying lowercase 'welcome10' through commerce.cartApplyPromotion...");
  const updatedCart = await commerce.cartApplyPromotion({ cartId, promoCode: "welcome10" });
  console.log("Resulting cart total:", updatedCart.subtotalGross);
  console.log("Resulting discount total:", updatedCart.discountTotal);
  console.log("Resulting promotions:", updatedCart.promotions);
}

testFrontendApply().catch(console.error);
