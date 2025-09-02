'use client';

import { useScrollBlock } from '@/hooks/useScrollBlock';
import { useCartStore } from '@/states/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';
import CloseButton from './close-button';

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
      className="fixed top-4 right-4 z-40"
      animate={{
        width: cartOpen ? '400px' : '46px',
        height: cartOpen ? '600px' : '46px',
        right: cartOpen ? '16px' : '16px',
        top: cartOpen ? 0 : '16px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.button
        onClick={() => setCartOpen(true)}
        className="relative flex h-full w-full items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800"
        animate={{
          borderRadius: cartOpen ? '16px' : '9999px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {!cartOpen && (
          <div className="flex items-center justify-center">
            <RiShoppingCart2Fill className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-whisper text-xl font-medium">Cart</h2>
              <button
                onClick={handleClearCart}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._key} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        {item.family} {item.weightName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        License: {item.license || 'Not selected'}
                      </p>
                      <p className="text-sm text-gray-400">
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
                      <p className="font-medium text-white">${item.price}</p>
                      <button
                        onClick={() => handleRemoveItem(item._key)}
                        className="mt-2 text-sm text-red-400 transition-colors hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-xl font-bold">
                  ${cart.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>
              <button className="w-full rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100">
                Checkout
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
