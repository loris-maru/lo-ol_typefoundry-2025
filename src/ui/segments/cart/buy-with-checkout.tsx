// components/BuyWithCheckout.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

// Check if Stripe key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function BuyWithCheckout({
  priceId,
  quantity = 1,
  label = "Buy now",
  className = "",
}: {
  priceId: string;
  quantity?: number;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // Check if Stripe is available
    if (!stripePromise) {
      setError("Stripe is not configured. Please contact support.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        setError(stripeError.message || "Checkout redirect failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if Stripe is not configured
  if (!stripePromise) {
    return (
      <div className="inline-flex flex-col items-stretch">
        <button
          disabled
          className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium shadow-md opacity-50 cursor-not-allowed ${className}`}
        >
          Stripe not configured
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-stretch">
      <button
        disabled={loading}
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium shadow-md transition disabled:opacity-50 ${className}`}
        aria-label={loading ? "Processing checkout..." : label}
        aria-busy={loading}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
            Processing…
          </span>
        ) : (
          label
        )}
      </button>
      {error && (
        <span className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
