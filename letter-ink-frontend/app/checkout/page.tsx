import { Suspense } from "react";
import type { Metadata } from "next";
import { getCart } from "@/app/cart/actions";
import { getStoreConfig } from "@/lib/store-config";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout — The Letter Ink",
  description: "Secure Checkout powered by Razorpay for The Letter Ink artisanal calligraphy & bespoke stationery.",
  robots: { index: false, follow: false },
};

async function CheckoutPageContent() {
  const [cart, storeConfig] = await Promise.all([
    getCart(),
    getStoreConfig(),
  ]);

  return (
    <CheckoutForm
      initialCart={cart}
      storeConfig={{
        currency: storeConfig.currency,
        locale: storeConfig.locale,
      }}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">Loading checkout...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
