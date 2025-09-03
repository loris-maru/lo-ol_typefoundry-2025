"use client";

import { useCartStore } from "@/states/cart";

export default function CancelPage() {
  const { cart } = useCartStore();

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Payment canceled</h1>
      <p className="mt-2 opacity-80">
        No charge was made. You can try again anytime.
      </p>

      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Your cart still contains {cart.length} item(s). You can continue
            shopping or try checkout again.
          </p>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <a
          href="/"
          className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </a>
        {cart.length > 0 && (
          <a
            href="/cart"
            className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Cart
          </a>
        )}
      </div>
    </main>
  );
}
