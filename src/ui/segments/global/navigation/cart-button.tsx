"use client";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { useCartStore } from "@/states/cart";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { RiShoppingCart2Fill } from "react-icons/ri";
import CloseButton from "./close-button";

export default function CartButton() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);

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

  // Only show cart button if there are items
  if (cart.length === 0) {
    return null;
  }

  return (
    <motion.nav
      className="fixed right-4 top-4 z-50"
      animate={{
        width: cartOpen ? "400px" : "46px",
        height: cartOpen ? "600px" : "46px",
        right: cartOpen ? "16px" : "16px",
        top: cartOpen ? "16px" : "16px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.button
        onClick={() => setCartOpen(true)}
        className="w-full h-full rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center relative"
        animate={{
          borderRadius: cartOpen ? "16px" : "9999px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!cartOpen && (
          <div className="flex items-center justify-center">
            <RiShoppingCart2Fill className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
            className="absolute inset-0 flex flex-col text-white bg-black p-6 rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium font-whisper">Cart</h2>
              <button
                onClick={handleClearCart}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div
                  key={item._key}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        {item.family} {item.weightName}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        License: {item.license || "Not selected"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Users: {item.users[0]}-{item.users[1]}
                      </p>
                      {item.widthName && (
                        <p className="text-sm text-gray-400">
                          Width: {item.widthName}
                        </p>
                      )}
                      {item.opticalSizeName && (
                        <p className="text-sm text-gray-400">
                          Optical Size: {item.opticalSizeName}
                        </p>
                      )}
                      {item.slantName && (
                        <p className="text-sm text-gray-400">
                          Slant: {item.slantName}
                        </p>
                      )}
                      {item.isItalic && (
                        <p className="text-sm text-gray-400">Italic</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-white">${item.price}</p>
                      <button
                        onClick={() => handleRemoveItem(item._key)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-xl font-bold">
                  ${cart.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>
              <button className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Cart - Only visible when expanded */}
      <AnimatePresence>
        {cartOpen && <CloseButton onClick={handleCartClose} />}
      </AnimatePresence>
    </motion.nav>
  );
}
