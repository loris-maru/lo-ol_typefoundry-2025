import { FiPlus } from "react-icons/fi";

export default function AddToCart() {
  return (
    <div className="relative">
      <button
        type="button"
        className="relative flex w-[280px] flex-row items-center justify-between rounded-full border border-solid border-black px-6 py-4"
        name="add-to-cart"
        onClick={() => {}}
        aria-label="Add to cart"
      >
        <span className="font-whisper relative top-px block text-xl font-medium">Add to cart</span>
        <FiPlus className="h-5 w-5" />
      </button>
    </div>
  );
}
