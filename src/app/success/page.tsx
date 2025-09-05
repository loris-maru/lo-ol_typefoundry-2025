"use client";

import { Suspense, useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useCartStore } from "@/states/cart";

function SuccessPageContent() {
  const [sessionData, setSessionData] = useState<{
    amount_total: number;
    customer_details?: { email: string };
    metadata?: { cart_items_count: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Fetch session details from your backend
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setSessionData(data);
            // Clear cart on successful payment
            clearCart();
          }
        })
        .catch((err) => {
          console.error("Error fetching session:", err);
          setError("Failed to verify payment");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
          <span className="ml-2">Verifying payment...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Payment Verification Failed</h1>
        <p className="mt-2 opacity-80">{error}</p>
        <p className="mt-4 text-sm opacity-60">
          If you believe this is an error, please contact support with your session ID: {sessionId}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Thanks! 🎉</h1>
      <p className="mt-2 opacity-80">Your payment was successful.</p>

      {sessionData && (
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left">
          <h2 className="mb-2 font-semibold">Purchase Details:</h2>
          <p className="text-sm opacity-80">
            <strong>Amount:</strong> ${(sessionData.amount_total / 100).toFixed(2)}
          </p>
          <p className="text-sm opacity-80">
            <strong>Email:</strong> {sessionData.customer_details?.email}
          </p>
          {sessionData.metadata && (
            <p className="text-sm opacity-80">
              <strong>Items:</strong> {sessionData.metadata.cart_items_count} font(s)
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <p className="text-sm opacity-60">
          You will receive a confirmation email shortly with your font licenses and download links.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </main>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
