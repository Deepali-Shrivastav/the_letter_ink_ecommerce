"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Package,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/app/cart/cart-context";

interface CheckoutFormProps {
  initialCart: any;
  storeConfig: {
    currency: string;
    locale: string;
  };
}

export function CheckoutForm({ initialCart, storeConfig }: CheckoutFormProps) {
  const router = useRouter();
  const { cart: contextCart } = useCart();
  const cart = contextCart || initialCart;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedOrderInfo, setSimulatedOrderInfo] = useState<any>(null);

  const items = cart?.lineItems ?? [];
  const rawSubtotal = cart?.subtotal ? Number(cart.subtotal) : 0;
  const discountTotal = cart?.discountTotal ? Number(cart.discountTotal) : 0;
  const grandTotal = Math.max(0, rawSubtotal - discountTotal);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Directly launch Razorpay
  const handleLaunchRazorpay = async () => {
    if (!items.length || isProcessing) return;
    setIsProcessing(true);

    try {
      await loadRazorpayScript();
      const res = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          amount: grandTotal,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay checkout");
      }

      // If live Razorpay checkout.js is available:
      if (typeof (window as any).Razorpay === "function") {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "The Letter Ink",
          description: "Artisanal Calligraphy & Bespoke Stationery",
          image: "/Logo.jpeg",
          order_id: orderData.orderId,
          theme: { color: "#201A1C" },
          handler: async function (response: any) {
            toast.loading("Verifying payment...", { id: "payment-verify" });
            const verifyRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                cartId: cart.id,
                amount: grandTotal,
                cartItems: items,
              }),
            });
            const verifyData = await verifyRes.json();
            toast.dismiss("payment-verify");
            if (verifyRes.ok && verifyData.success) {
              router.push(`/order/success/${verifyData.orderId}`);
            } else {
              toast.error("Payment verification failed");
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // In test/demo mode:
      setSimulatedOrderInfo(orderData);
      setShowSimulatedModal(true);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || "Failed to launch Razorpay");
    }
  };

  // Automatically trigger Razorpay when navigating to /checkout
  useEffect(() => {
    if (items.length > 0) {
      handleLaunchRazorpay();
    }
  }, [items.length]);

  const handleSimulateSuccess = async () => {
    setShowSimulatedModal(false);
    setIsProcessing(true);
    toast.loading("Completing order...", { id: "payment-verify" });

    try {
      const verifyRes = await fetch("/api/checkout/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: simulatedOrderInfo?.orderId || `order_sim_${Date.now()}`,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: "simulated_signature",
          cartId: cart?.id,
          amount: grandTotal,
          cartItems: items,
        }),
      });

      const verifyData = await verifyRes.json();
      toast.dismiss("payment-verify");

      if (verifyRes.ok && verifyData.success) {
        router.push(`/order/success/${verifyData.orderId}`);
      } else {
        toast.error("Payment completion failed.");
      }
    } catch {
      setIsProcessing(false);
      toast.error("Could not complete order.");
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Add items to your cart before proceeding to checkout.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/shop">Browse Collections</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Studio</span>
          </Link>

          <Link href="/" className="font-serif text-xl tracking-wider uppercase font-semibold text-foreground">
            The Letter Ink
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-full border border-border/40">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">Razorpay Secured</span>
          </div>
        </div>
      </header>

      {/* Direct Razorpay Bridge Content */}
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
            <ShieldCheck className="h-9 w-9" />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-foreground">
              Razorpay Secure Checkout
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Direct payment gateway for UPI, Credit/Debit Cards, NetBanking & Wallets
            </p>
          </div>

          {/* Amount Badge */}
          <div className="bg-secondary/40 py-4 px-6 rounded-2xl border border-border/60 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Payable</span>
            <span className="text-2xl font-bold text-foreground">
              {formatMoney({
                amount: BigInt(grandTotal),
                currency: storeConfig.currency,
                locale: storeConfig.locale,
              })}
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleLaunchRazorpay}
            disabled={isProcessing}
            size="lg"
            className="w-full h-14 rounded-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Redirecting to Razorpay…</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Pay with Razorpay</span>
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Protected by 256-bit bank grade encryption & RBI PCI-DSS compliance.
          </p>
        </div>
      </main>

      {/* Simulated Razorpay Modal */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  RZP
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Razorpay Checkout Gateway</h4>
                  <p className="text-[11px] text-muted-foreground">Test & Development Environment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulatedModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-secondary/40 p-4 rounded-xl space-y-2 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Merchant:</span>
                <span className="font-semibold text-foreground">The Letter Ink</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Payment Methods:</span>
                <span className="font-medium text-foreground">UPI • Cards • NetBanking</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-xs font-semibold text-foreground">Amount:</span>
                <span className="text-lg font-bold text-primary">
                  {formatMoney({
                    amount: BigInt(grandTotal),
                    currency: storeConfig.currency,
                    locale: storeConfig.locale,
                  })}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-left">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Click below to complete the simulated Razorpay payment and proceed to order confirmation.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSimulatedModal(false)}
                className="flex-1 rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSimulateSuccess}
                className="flex-1 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> Simulate Success
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
