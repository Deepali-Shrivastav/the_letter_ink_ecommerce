import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Phase 3: Safe Test/Seed Data Identification Script
 * 
 * This script performs a DRY RUN to identify common test/demo data in the database
 * without deleting anything. It looks for common patterns (e.g., 'test@', 'example.com',
 * 'demo-', 'sample-') in users, customers, and products.
 * 
 * Usage: npx medusa exec ./src/scripts/find-and-remove-test-data.ts
 */
export default async function findTestAndSeedData({ container }: ExecArgs) {
  console.log("==========================================");
  console.log("   Starting Safe Test Data Identification ");
  console.log("==========================================");

  const query = container.resolve("query");

  // 1. Identify Test Customers
  console.log("\n[1] Scanning for Test Customers...");
  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "email", "first_name", "last_name"],
  });

  const testCustomers = customers.filter(c => 
    c.email?.toLowerCase().includes("test") || 
    c.email?.toLowerCase().includes("example.com") ||
    c.email?.toLowerCase().includes("demo") ||
    c.first_name?.toLowerCase().includes("test")
  );

  if (testCustomers.length > 0) {
    console.log(`⚠️ Found ${testCustomers.length} potential test customers:`);
    testCustomers.forEach(c => console.log(`   - ${c.email} (ID: ${c.id})`));
  } else {
    console.log("✅ No test customers found.");
  }

  // 2. Identify Test Users (Admin)
  console.log("\n[2] Scanning for Test Admin Users...");
  const { data: users } = await query.graph({
    entity: "user",
    fields: ["id", "email", "first_name", "last_name"],
  });

  const testUsers = users.filter(u => 
    u.email?.toLowerCase().includes("test") || 
    u.email?.toLowerCase().includes("example.com") ||
    u.email?.toLowerCase().includes("demo")
  );

  if (testUsers.length > 0) {
    console.log(`⚠️ Found ${testUsers.length} potential test admin users:`);
    testUsers.forEach(u => console.log(`   - ${u.email} (ID: ${u.id})`));
  } else {
    console.log("✅ No test admin users found.");
  }

  // 3. Identify Test Products
  console.log("\n[3] Scanning for Test Products...");
  const productService = container.resolve(Modules.PRODUCT);
  const products = await productService.listProducts({});
  
  const testProducts = products.filter(p => 
    p.handle?.toLowerCase().includes("test") || 
    p.handle?.toLowerCase().includes("demo") ||
    p.handle?.toLowerCase().includes("sample") ||
    p.title?.toLowerCase().includes("test")
  );

  if (testProducts.length > 0) {
    console.log(`⚠️ Found ${testProducts.length} potential test products:`);
    testProducts.forEach(p => console.log(`   - ${p.title} (Handle: ${p.handle}, ID: ${p.id})`));
  } else {
    console.log("✅ No test products found.");
  }

  // 4. Identify Test Orders
  console.log("\n[4] Scanning for Orders placed by Test Customers...");
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "email", "total"],
  });

  const testOrders = orders.filter(o => 
    o.email?.toLowerCase().includes("test") || 
    o.email?.toLowerCase().includes("example.com") ||
    o.email?.toLowerCase().includes("demo")
  );

  if (testOrders.length > 0) {
    console.log(`⚠️ Found ${testOrders.length} potential test orders:`);
    testOrders.forEach(o => console.log(`   - Order ${o.id} (Email: ${o.email})`));
  } else {
    console.log("✅ No test orders found.");
  }

  console.log("\n==========================================");
  console.log("   Identification Complete                ");
  console.log("==========================================");
  
  console.log(`\n🚨 ACTION REQUIRED:`);
  console.log(`This was a DRY RUN. No records have been deleted.`);
  console.log(`If you wish to remove these records, please review them manually or`);
  console.log(`modify this script to execute delete operations explicitly.`);
}
