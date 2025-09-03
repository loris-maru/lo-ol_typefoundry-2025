"use client";

import { useCartStore, type SingleCartItem } from "@/states/cart";
import CartCheckout from "./cart-checkout";

export default function CartSummary() {
  const { cart, removeFromCart } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600">Add some fonts to get started!</p>
      </div>
    );
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem
            key={item._key}
            item={item}
            onRemove={() => removeFromCart(item._key)}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <CartCheckout
        label="Proceed to Checkout"
        className="w-full bg-black text-white hover:bg-gray-800"
      />
    </div>
  );
}

function CartItem({
  item,
  onRemove,
}: {
  item: SingleCartItem;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.fullName}</h4>
        <p className="text-sm text-gray-600 mb-2">{item.license} License</p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Font:</span> {item.family}
          </p>
          <p>
            <span className="font-medium">Weight:</span> {item.weightName}
          </p>
          <p>
            <span className="font-medium">Width:</span> {item.widthName}
          </p>
          <p>
            <span className="font-medium">Optical Size:</span>{" "}
            {item.opticalSizeName}
          </p>
          <p>
            <span className="font-medium">Slant:</span> {item.slantName}
          </p>
          <p>
            <span className="font-medium">Users:</span> {item.users[0]}-
            {item.users[1]}
          </p>

          {item.isItalic && (
            <p>
              <span className="font-medium">Style:</span> Italic
            </p>
          )}
          {item.hasSerif && (
            <p>
              <span className="font-medium">Serif:</span> {item.serifStyleValue}
            </p>
          )}
          {item.has_MONO && (
            <p>
              <span className="font-medium">Mono:</span> {item.monoStyleName}
            </p>
          )}
          {item.has_STEN && (
            <p>
              <span className="font-medium">Stencil:</span>{" "}
              {item.stencilStyleName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2 ml-4">
        <span className="text-lg font-semibold text-gray-900">
          ${item.price.toFixed(2)}
        </span>
        <button
          onClick={onRemove}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
