async function main() {
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
  console.log("Cart created:", cartId);

  const prodRes = await fetch('http://localhost:9000/store/products?handle=handwritten-letters', { headers });
  const prodData = await prodRes.json();
  const variantId = prodData.products[0].variants[0].id;
  console.log("Variant ID:", variantId);

  const lineRes = await fetch(`http://localhost:9000/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ variant_id: variantId, quantity: 1 })
  });
  const lineData = await lineRes.json();
  console.log("Line added:", lineData.cart?.items?.length, "items. Subtotal:", lineData.cart?.subtotal, "Total:", lineData.cart?.total);

  // Apply WELCOME10
  console.log("\n--- Applying WELCOME10 ---");
  const promoRes = await fetch(`http://localhost:9000/store/carts/${cartId}/promotions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ promo_codes: ['WELCOME10'] })
  });
  const promoData = await promoRes.json();
  console.log("Promo status:", promoRes.status);
  console.log("Promo response:", JSON.stringify(promoData, null, 2));

  // Also test lowercase welcome10
  console.log("\n--- Applying welcome10 (lowercase) ---");
  const promoLowerRes = await fetch(`http://localhost:9000/store/carts/${cartId}/promotions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ promo_codes: ['welcome10'] })
  });
  const promoLowerData = await promoLowerRes.json();
  console.log("Promo lower status:", promoLowerRes.status);
  console.log("Promo lower response:", JSON.stringify(promoLowerData, null, 2));
}

main().catch(console.error);
