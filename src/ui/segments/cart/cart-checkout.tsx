"use client";

import { LicenseType, UserTier } from "@/lib/pricing";
import { useCartStore } from "@/states/cart";
import { CartItem, CartPayload } from "@/lib/cart";
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
      console.log("Cart items before transformation:", cart);
      console.log("Cart length:", cart.length);
      console.log(
        "Cart items details:",
        cart.map((item) => ({
          _key: item._key,
          family: item.family,
          fullName: item.fullName,
          license: item.license,
        })),
      );

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

        // Slugify the family name for fontFamilyId
        console.log(`Processing item:`, {
          _key: item._key,
          family: item.family,
          fullName: item.fullName,
          license: item.license,
          allKeys: Object.keys(item),
        });

        // Try to extract family name from different possible fields
        let familyName = item.family;
        if (!familyName && item.fullName) {
          // Try to extract family name from fullName (e.g., "Banya Mist Regular" -> "Banya Mist")
          familyName = item.fullName.split(" ").slice(0, -1).join(" ");
        }

        const fontFamilyId = familyName
          ? familyName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          : "unknown-family";

        console.log(
          `Generated fontFamilyId: ${fontFamilyId} from family: ${familyName} (original: ${item.family})`,
        );

        return {
          fontId: item.fontID, // Use the actual filename from Sanity
          fontFamilyId, // Slugified family name
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

      console.log("Transformed cart items:", cartItems);
      console.log("Cart payload:", cartPayload);
      console.log(
        "Cart payload items details:",
        cartPayload.items.map((item) => ({
          fontId: item.fontId,
          fontFamilyId: item.fontFamilyId,
          licenseType: item.licenseType,
          userTier: item.userTier,
        })),
      );

      // Call checkout API
      console.log("Calling /api/checkout with payload:", cartPayload);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartPayload),
      });

      console.log("Checkout response status:", response.status);
      console.log("Checkout response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If response is not JSON, get the text content
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          throw new Error(`Checkout failed: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.error || "Checkout failed");
      }

      let checkoutData;
      try {
        checkoutData = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse checkout response as JSON:", jsonError);
        throw new Error("Invalid response from checkout server");
      }

      const { id: sessionId, url: checkoutUrl } = checkoutData;

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
