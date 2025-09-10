"use client";

import { CartItem, CartPayload } from "@/lib/cart";
import { LicenseType, UserTier } from "@/lib/pricing";
import { useCartStore } from "@/states/cart";
import { useState } from "react";

interface CartCheckoutProps {
  label?: string;
  className?: string;
}

export default function CartCheckout({ label = "Checkout", className = "" }: CartCheckoutProps) {
  const { cart, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Transform cart data to API format using your pricing types
      const cartItems: CartItem[] = cart.map((item) => {
        // Map license format using your LicenseType
        let licenseType: LicenseType = "Web";
        if (item.license.toLowerCase().includes("print")) {
          licenseType = "Print";
        } else if (item.license.toLowerCase().includes("both")) {
          licenseType = "Both";
        }

        // Map user tier using your UserTier
        const userCount = item.users[1];
        let userTier: UserTier = "1-4";
        if (userCount <= 4) {
          userTier = "1-4";
        } else if (userCount <= 10) {
          userTier = "5-10";
        } else if (userCount <= 20) {
          userTier = "11-20";
        } else {
          userTier = "21+";
        }

        return {
          fontId: item._key, // Using _key as fontId for now
          fontFamilyId: item.family, // Using family name as ID for now
          licenseType,
          userTier,
          weight: item.weightValue,
          width: item.widthValue,
          slant: item.slantValue,
          opticalSize: item.opticalSizeValue,
          isItalic: item.isItalic,
          qty: 1,
        };
      });

      const cartPayload: CartPayload = {
        items: cartItems,
      };

      // Call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Checkout failed");
      }

      const { id: sessionId, url: checkoutUrl } = await response.json();

      // Redirect to Stripe Checkout
      if (checkoutUrl) {
        // Clear cart on successful checkout initiation
        clearCart();

        // Redirect to Stripe Checkout using the official URL
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading || cart.length === 0}
        className={`rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isLoading ? "Processing..." : label}
      </button>
    </div>
  );
}
