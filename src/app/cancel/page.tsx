"use client";

import Link from "next/link";

import { useCartStore } from "@/states/cart";

export default function CancelPage() {
  const { cart } = useCartStore();

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Payment canceled</h1>
      <p className="mt-2 opacity-80">No charge was made. You can try again anytime.</p>

      {cart.length > 0 && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Your cart still contains {cart.length} item(s). You can continue shopping or try
            checkout again.
          </p>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <Link
          href="/"
          className="inline-block rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
        {cart.length > 0 && (
          <Link
            href="/cart"
            className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            View Cart
          </Link>
        )}
      </div>
    </main>
  );
}
