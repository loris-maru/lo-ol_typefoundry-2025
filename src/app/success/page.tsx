"use client";

import { useCartStore } from "@/states/cart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [sessionData, setSessionData] = useState<any>(null);
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
        <h1 className="text-2xl font-semibold text-red-600">
          Payment Verification Failed
        </h1>
        <p className="mt-2 opacity-80">{error}</p>
        <p className="mt-4 text-sm opacity-60">
          If you believe this is an error, please contact support with your
          session ID: {sessionId}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Thanks! 🎉</h1>
      <p className="mt-2 opacity-80">Your payment was successful.</p>

      {sessionData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
          <h2 className="font-semibold mb-2">Purchase Details:</h2>
          <p className="text-sm opacity-80">
            <strong>Amount:</strong> $
            {(sessionData.amount_total / 100).toFixed(2)}
          </p>
          <p className="text-sm opacity-80">
            <strong>Email:</strong> {sessionData.customer_details?.email}
          </p>
          {sessionData.metadata && (
            <p className="text-sm opacity-80">
              <strong>Items:</strong> {sessionData.metadata.cart_items_count}{" "}
              font(s)
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <p className="text-sm opacity-60">
          You will receive a confirmation email shortly with your font licenses
          and download links.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
}
