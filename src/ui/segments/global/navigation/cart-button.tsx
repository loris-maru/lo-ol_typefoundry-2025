"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { RiShoppingCart2Fill } from "react-icons/ri";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { CartItem, CartPayload } from "@/lib/cart";
import { LicenseType, UserTier } from "@/lib/pricing";
import { useCartStore } from "@/states/cart";

import CloseButton from "./close-button";

export default function CartButton() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Block page scrolling when cart is open
  useScrollBlock(cartOpen);

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleRemoveItem = (key: string) => {
    removeFromCart(key);
  };

  const handleClearCart = () => {
    clearCart();
  };

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
          fontId: item.fontID, // Use the actual filename from Sanity
          fontFamilyId: item.family, // This might be the issue - using family name instead of ID
          licenseType,
          userTier,
          weight: item.weightValue,
          width: item.widthValue,
          slant: item.slantValue,
          opticalSize: item.opticalSizeValue,
          isItalic: item.isItalic,
          qty: 1,
          type: "static",
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

  // Only show cart button if there are items
  if (cart.length === 0) {
    return null;
  }

  return (
    <motion.nav
      className="fixed"
      animate={{
        width: cartOpen ? "400px" : "64px",
        height: cartOpen ? "600px" : "64px",
        right: cartOpen ? "16px" : "16px",
        top: cartOpen ? "16px" : "16px",
        zIndex: cartOpen ? 100 : 60,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.button
        onClick={() => setCartOpen(true)}
        className="relative flex h-full w-full items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800"
        animate={{
          borderRadius: cartOpen ? "16px" : "9999px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!cartOpen && (
          <div className="flex items-center justify-center">
            <RiShoppingCart2Fill className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white">
                {cart.length}
              </span>
            )}
          </div>
        )}
      </motion.button>

      {/* Cart Content - Only appears after expansion */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-black p-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <h2 className="font-whisper mb-6 text-xl font-medium">Cart</h2>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._key} className="rounded-lg border border-neutral-600 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-whisper text-xl font-medium text-white">
                        {item.family} {item.weightName}
                      </h3>
                      <p className="font-whisper mt-1 text-sm text-gray-400">
                        License: {item.license || "Not selected"}
                      </p>
                      <p className="font-whisper text-sm text-gray-400">
                        Users: {item.users[0]}-{item.users[1]}
                      </p>
                      {item.widthName && (
                        <p className="text-sm text-gray-400">Width: {item.widthName}</p>
                      )}
                      {item.opticalSizeName && (
                        <p className="text-sm text-gray-400">
                          Optical Size: {item.opticalSizeName}
                        </p>
                      )}
                      {item.slantName && (
                        <p className="text-sm text-gray-400">Slant: {item.slantName}</p>
                      )}
                      {item.isItalic && <p className="text-sm text-gray-400">Italic</p>}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-whisper text-xl font-medium text-white">${item.price}</p>
                      <button
                        onClick={() => handleRemoveItem(item._key)}
                        className="font-whisper mt-2 text-sm text-red-400 transition-colors hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              {error && (
                <div className="mb-4 rounded-md bg-red-900/20 p-3">
                  <div className="text-sm text-red-300">{error}</div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <span className="font-whisper text-xl font-medium">Total:</span>
                <span className="font-whisper text-xl font-medium">
                  ${cart.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>

              <button
                type="button"
                aria-label="Checkout"
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                className="font-whisper w-full cursor-pointer rounded-full bg-white px-6 py-4 text-2xl font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Cart - Only visible when expanded */}
      <AnimatePresence>{cartOpen && <CloseButton onClick={handleCartClose} />}</AnimatePresence>
    </motion.nav>
  );
}
