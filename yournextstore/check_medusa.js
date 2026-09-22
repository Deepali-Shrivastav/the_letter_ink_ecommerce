const Medusa = require("@medusajs/medusa-js").default;

const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableApiKey: "pk_63a72c5bee39e67a8be438c3dabd0b63dcf83417c2ecd9180d0d6105b068303b",
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
