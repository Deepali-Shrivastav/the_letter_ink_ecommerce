import axios from 'axios';

async function test() {
  const headers = { 'x-publishable-api-key': 'pk_63a72c5bee39e67a8be438c3dabd0b63dcf83417c2ecd9180d0d6105b068303b' };
  try {
    // 1. Create a cart
    const createCartRes = await axios.post('http://localhost:9000/store/carts', {}, { headers });
    const cart = createCartRes.data.cart;
    console.log("Cart created:", cart.id);

    // 2. Fetch variants to get a real variant_id
    const productsRes = await axios.get('http://localhost:9000/store/products', { headers });
    const variant_id = productsRes.data.products[0].variants[0].id;
    console.log("Using variant:", variant_id);

    // 3. Add to cart using custom route
    const addRes = await axios.post(`http://localhost:9000/store/carts/${cart.id}/line-items/custom`, {
      variant_id: variant_id,
      quantity: 1,
      unit_price: 9999, // Custom price!
      metadata: { custom_unit_price: 9999 }
    }, { headers });
    console.log("Added to cart:", addRes.data.success);

    // 4. Retrieve cart to check price
    const retrieveRes = await axios.get(`http://localhost:9000/store/carts/${cart.id}`, { headers });
    const lineItem = retrieveRes.data.cart.items[0];
    console.log("Line Item Price:", lineItem.unit_price);
    if (lineItem.unit_price === 9999) {
      console.log("SUCCESS: Custom price was accepted!");
    } else {
      console.log("FAILED: Custom price was ignored.", lineItem.unit_price);
    }
  } catch (e: any) {
    console.error(e?.response?.data || e.message);
  }
}

test();
