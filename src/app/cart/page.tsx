import CartSummary from "@/ui/segments/cart/cart-summary";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartSummary />
    </main>
  );
}
