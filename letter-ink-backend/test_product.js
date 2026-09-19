const Medusa = require('@medusajs/medusa-js').default;

const client = new Medusa({ baseUrl: 'http://localhost:9000', maxRetries: 0 });

async function createProduct() {
  try {
    // Note: this requires authentication. We can't easily test this from a script without a token.
    // Let's just create the admin page and test it from the browser where the session exists.
    console.log("Will test from admin UI directly.");
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

createProduct();
