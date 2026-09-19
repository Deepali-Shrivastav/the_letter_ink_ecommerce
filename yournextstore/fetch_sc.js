const Medusa = require("@medusajs/medusa-js").default;

const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
});

async function main() {
  try {
    // If Admin API is open in dev, we can fetch sales channels
    // Usually need auth, but let's try
    const res = await fetch("http://localhost:9000/admin/sales-channels", {
      headers: {
        // Need basic auth? Usually medusa backend dev allows admin if we pass a token or basic auth.
      }
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
