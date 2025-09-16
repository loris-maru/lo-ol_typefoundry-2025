import { RiDeleteBin5Line } from "react-icons/ri";

import { SingleCartItem } from "@/states/cart";
import AddToCart from "@/ui/segments/collection/custom/add-to-cart";

export default function CartList({
  customCartItems,
  removeFromCart,
  handleAddToCart,
}: {
  customCartItems: SingleCartItem[];
  removeFromCart: (key: string) => void;
  handleAddToCart: () => void;
}) {
  return (
    <aside
      id="custom-item-cart-container"
      className="relative z-10 flex w-full flex-row items-center justify-between gap-x-4 pt-6"
    >
      {/* Cart Items List */}
      <div className="flex max-h-32 flex-col gap-y-2 overflow-y-auto">
        {customCartItems.map((item) => (
          <button
            key={item._key}
            type="button"
            onClick={() => removeFromCart(item._key)}
            className="flex flex-row items-center gap-x-6 border border-solid border-neutral-300 px-4 py-2 transition-colors duration-200 hover:bg-gray-50"
            aria-label={`Remove ${item.fontID} from cart`}
          >
            <span className="font-whisper text-base font-normal text-black">{item.fontID}</span>
            <RiDeleteBin5Line className="h-4 w-4 text-gray-600" />
          </button>
        ))}
      </div>

      {/* Price and Add to Cart */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="font-whisper text-base font-medium">CHF 60</div>
        <AddToCart addToCart={handleAddToCart} />
      </div>
    </aside>
  );
}
