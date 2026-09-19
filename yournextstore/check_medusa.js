const Medusa = require("@medusajs/medusa-js").default;

const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableApiKey: "pk_22aed401e4e1f40b61fb80d5528e4dfdf39a82188d2af4d2cf11d396977ce54c",
  maxRetries: 3,
});

async function main() {
  try {
    const prods = await medusa.products.list({ collection_id: ["pcol_01M2W876ZGXG1B59ZB1PPGP42P"] });
    console.log("Hampers Products:", prods.products.map(p => p.title));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
