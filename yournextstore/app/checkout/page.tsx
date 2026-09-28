import type { Metadata } from "next";
import { getCart } from "@/app/cart/actions";
import { getStoreConfig } from "@/lib/store-config";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout — The Letter Ink",
  description: "Secure Checkout powered by Razorpay for The Letter Ink artisanal calligraphy & bespoke stationery.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
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
