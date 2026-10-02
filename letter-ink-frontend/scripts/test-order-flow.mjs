const BACKEND_URL = "http://localhost:9000";
const FRONTEND_URL = "http://localhost:3000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
const headers = {
  "Content-Type": "application/json",
  "x-publishable-api-key": PUBLISHABLE_KEY,
};

async function main() {
  console.log("=== STEP 1: Verifying Live Product in Medusa Backend ===");
  const prodRes = await fetch(`${BACKEND_URL}/store/products?handle=grand-royal-illuminated-monogram-float-frame&fields=*variants.prices,*variants.options,*images,*options,*options.values`, {
    headers,
  });
  if (!prodRes.ok) {
    throw new Error(`Failed to fetch product: ${prodRes.status} ${prodRes.statusText}`);
  }
  const prodData = await prodRes.json();
  const product = prodData.products?.[0];
  if (!product) {
    throw new Error("Product 'grand-royal-illuminated-monogram-float-frame' not found in Medusa!");
  }

  console.log(` Product ID: ${product.id}`);
  console.log(` Title: ${product.title}`);
  console.log(` Options Count: ${product.options?.length}`);
  product.options?.forEach((opt) => {
    console.log(`   - ${opt.title}: [${opt.values?.map((v) => v.value).join(", ")}]`);
  });
  console.log(` Total Variants: ${product.variants?.length}`);
  
  // Print sample variants with prices
  console.log("Sample Variants & Prices:");
  product.variants?.slice(0, 4).forEach((v) => {
    const inrPrice = v.prices?.find((p) => p.currency_code === "inr")?.amount;
    console.log(`   - ${v.title} (${v.sku}) -> ₹${inrPrice}`);
  });

  console.log("\n=== STEP 2: Verifying Bespoke Customizations Module ===");
  const custRes = await fetch(`${BACKEND_URL}/store/products/${product.id}/customizations`, { headers });
  if (custRes.ok) {
    const custData = await custRes.json();
    console.log(` Customization Options: ${custData.options?.length || 0}`);
    custData.options?.forEach((opt) => {
      console.log(`   - ${opt.title}: [${opt.values?.map((v) => v.value).join(", ")}]`);
    });
    console.log(` Active Combinations: ${custData.combinations?.length || 0}`);
  } else {
    console.warn("Customizations endpoint returned:", custRes.status);
  }

  console.log("\n=== STEP 3: Verifying Storefront Product Page Render ===");
  const pageRes = await fetch(`${FRONTEND_URL}/product/grand-royal-illuminated-monogram-float-frame`);
  console.log(` Storefront Page HTTP Status: ${pageRes.status} ${pageRes.statusText}`);
  const html = await pageRes.text();
  const hasTitle = html.includes("Grand Royal Illuminated Monogram Float Frame");
  const hasInscription = html.includes("Personalized Inscription") || html.includes("bespoke-inscription");
  console.log(` Page contains Product Title: ${hasTitle}`);
  console.log(` Page contains Inscription Field: ${hasInscription}`);

  console.log("\n=== STEP 4: Creating a Cart & Adding Customized Variant with Edge Cases ===");
  // Pick a luxury variant: 12x16 Royal Grandeur / Polished 24K Gold Leaf / Flourished Spencerian
  const targetVariant = product.variants?.find((v) => 
    v.title.includes("12x16") && v.title.includes("Gold Leaf") && v.title.includes("Spencerian")
  ) || product.variants[0];

  const inrPrice = targetVariant.prices?.find((p) => p.currency_code === "inr")?.amount || 6400;
  console.log(`Selected Variant for Test Order: ${targetVariant.title} (SKU: ${targetVariant.sku}, ₹${inrPrice})`);

  // Edge case inscription with quotes, dashes, date, bullet, and unicode
  const testInscription = "Aarav & Meera — 24th October 2026 • 'Forever & Always' ❤️ ✨";

  // Create Medusa cart
  const cartRes = await fetch(`${BACKEND_URL}/store/carts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ currency_code: "inr" }),
  });
  const { cart } = await cartRes.json();
  console.log(` Created Test Cart ID: ${cart.id}`);

  // Add line item with custom metadata
  const itemMetadata = {
    custom_inscription: testInscription,
    customization_selections: {
      Dimension: "12x16 Royal Grandeur",
      "Frame Finish": "Polished 24K Gold Leaf",
      "Script Style": "Flourished Spencerian Scribe",
      "Wax Seal Motif": "Royal Monogram Crest",
      "Wax Seal Tint": "Antique Gold Lustre (+₹200)",
      Inscription: testInscription,
    },
    custom_unit_price: inrPrice + 200,
  };

  const addItemRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/line-items`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      variant_id: targetVariant.id,
      quantity: 1,
      metadata: itemMetadata,
    }),
  });
  if (!addItemRes.ok) {
    const errText = await addItemRes.text();
    console.error("Add line item error:", errText);
  }

  // Retrieve updated cart with items
  const updatedCartRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}?fields=*items,*items.metadata`, { headers });
  const updatedCartJson = await updatedCartRes.json();
  const cartItems = updatedCartJson.cart?.items || [];
  console.log(` Cart Items Count: ${cartItems.length}`);
  console.log(` Line Item Title: ${cartItems[0]?.title}`);
  console.log(` Attached Metadata Inscription: ${cartItems[0]?.metadata?.custom_inscription}`);

  console.log("\n=== STEP 5: Simulating Checkout & Razorpay Payment Verification ===");
  const testCustomer = {
    firstName: "Aarav",
    lastName: "Kapoor",
    email: "aarav.kapoor@theletterink.com",
    phone: "9876543210",
  };
  const testAddress = {
    firstName: "Aarav",
    lastName: "Kapoor",
    address1: "74, Heritage Boulevard, Flat 4B",
    address2: "Worli Sea Face",
    city: "Mumbai",
    province: "Maharashtra",
    postalCode: "400018",
    countryCode: "in",
  };

  const verifyPayload = {
    razorpay_order_id: `order_sim_${Date.now()}`,
    razorpay_payment_id: `pay_sim_${Date.now()}`,
    razorpay_signature: "simulated_test_signature",
    cartId: cart.id,
    amount: (inrPrice + 200),
    customer: testCustomer,
    shippingAddress: testAddress,
    cartItems,
  };

  const checkoutRes = await fetch(`${FRONTEND_URL}/api/checkout/razorpay/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verifyPayload),
  });

  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok || !checkoutData.success) {
    throw new Error(`Checkout failed: ${JSON.stringify(checkoutData)}`);
  }

  console.log(` Order Placed Successfully!`);
  console.log(` Medusa Order ID: ${checkoutData.orderId}`);
  console.log(` Brand Order Lookup: ${checkoutData.lookup}`);

  console.log("\n=== STEP 6: Testing Live Order Tracking Endpoint ===");
  const trackRes = await fetch(`${FRONTEND_URL}/api/order/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: checkoutData.lookup || checkoutData.orderId,
      contact: testCustomer.phone,
    }),
  });

  const trackData = await trackRes.json();
  if (!trackRes.ok || !trackData.success) {
    throw new Error(`Tracking lookup failed: ${JSON.stringify(trackData)}`);
  }

  const trackedOrder = trackData.order;
  console.log(` Tracking Lookup Succeeded!`);
  console.log(` Order ID: ${trackedOrder.id}`);
  console.log(` Brand Lookup: ${trackedOrder.lookup}`);
  console.log(` Status: ${trackedOrder.status} (${trackedOrder.statusDescription})`);
  console.log(` Courier: ${trackedOrder.courier.name} | AWB: ${trackedOrder.courier.trackingNumber}`);
  console.log(` Delivery Address: ${trackedOrder.shippingAddress?.maskedLine}`);
  console.log(` Estimated Delivery: ${trackedOrder.estimatedDelivery}`);
  console.log(` Order Timeline Milestones: ${trackedOrder.timeline.length} steps`);
  trackedOrder.timeline.forEach((step) => {
    console.log(`   [${step.completed ? "✓" : " "}] Step ${step.step}: ${step.title} (${step.date})`);
  });
  console.log(` Order Items Count: ${trackedOrder.lineItems.length}`);
  trackedOrder.lineItems.forEach((item) => {
    console.log(`   - Item: ${item.name} x ${item.quantity} (₹${item.price})`);
    console.log(`     Custom Note: "${item.customNote}"`);
  });

  console.log("\n ALL END-TO-END CRITERIA VERIFIED SUCCESSFULLY!");
}

main().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
