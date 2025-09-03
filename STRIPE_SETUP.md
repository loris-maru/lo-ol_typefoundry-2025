# Stripe Checkout Integration Setup

This guide will help you set up Stripe checkout integration for your cart system.

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 2. Stripe Dashboard Setup

### Get Your API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env.local` file

### Set Up Webhooks

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add it to your `.env.local` file

## 3. Usage

### Cart Checkout Component

```tsx
import CartCheckout from "@/ui/segments/cart/cart-checkout";

// Use in your cart page
<CartCheckout
  label="Proceed to Checkout"
  className="w-full bg-black text-white"
/>;
```

### Cart Summary Component

```tsx
import CartSummary from "@/ui/segments/cart/cart-summary";

// Use in your cart page
<CartSummary />;
```

### Individual Product Checkout

```tsx
import BuyWithCheckout from "@/ui/segments/cart/buy-with-checkout";

// For single product purchases
<BuyWithCheckout priceId="price_1234567890" quantity={1} label="Buy Now" />;
```

## 4. Cart Integration

The cart system automatically integrates with Stripe:

- **Add to Cart**: Use `useCartStore().addToCart(item)`
- **Remove from Cart**: Use `useCartStore().removeFromCart(key)`
- **Clear Cart**: Use `useCartStore().clearCart()`
- **Checkout**: Use `CartCheckout` component

## 5. Cart Item Structure

Your cart items should follow this structure:

```typescript
type SingleCartItem = {
  _key: string;
  fullName: string;
  license: string;
  users: [number, number];
  family: string;
  weightName: string;
  weightValue: number;
  widthName: string;
  widthValue: number;
  opticalSizeName: string;
  opticalSizeValue: number;
  slantName: string;
  slantValue: number;
  isItalic: boolean;
  hasSerif: boolean;
  serifStyleValue: number;
  has_MONO: boolean;
  monoStyleName: string;
  monoStyleValue: number;
  has_STEN: boolean;
  stencilStyleName: string;
  stencilStyleValue: number;
  price: number;
};
```

## 6. Testing

### Test Mode

- Use test API keys (starting with `pk_test_` and `sk_test_`)
- Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing)

### Test Card Numbers

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 7. Production Deployment

1. Replace test keys with live keys
2. Update webhook endpoint URL to production domain
3. Test the complete flow in production

## 8. Features Included

- ✅ Cart management with Zustand
- ✅ Stripe Checkout integration
- ✅ Webhook handling for payment events
- ✅ Success/cancel page handling
- ✅ Cart persistence in localStorage
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Payment verification

## 9. Customization

You can customize:

- Styling by modifying the className props
- Payment methods in the Stripe dashboard
- Webhook events and handling
- Success/cancel page content
- Cart item display format
