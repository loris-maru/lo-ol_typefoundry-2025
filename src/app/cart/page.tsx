import CartSummary from "@/ui/segments/cart/cart-summary";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <CartSummary />
    </main>
  );
}
