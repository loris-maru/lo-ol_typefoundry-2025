import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

import { SingleCartItem } from "@/states/cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { cartItems }: { cartItems: SingleCartItem[] } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe checkout
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.fullName} - ${item.license} License`,
          description: `Font: ${item.family} | Weight: ${item.weightName} | Width: ${item.widthName} | Optical Size: ${item.opticalSizeName} | Slant: ${item.slantName} | Users: ${item.users[0]}-${item.users[1]}`,
          metadata: {
            font_family: item.family,
            weight_name: item.weightName,
            weight_value: item.weightValue.toString(),
            width_name: item.widthName,
            width_value: item.widthValue.toString(),
            optical_size_name: item.opticalSizeName,
            optical_size_value: item.opticalSizeValue.toString(),
            slant_name: item.slantName,
            slant_value: item.slantValue.toString(),
            is_italic: item.isItalic.toString(),
            has_serif: item.hasSerif.toString(),
            serif_style_value: item.serifStyleValue.toString(),
            has_mono: item.has_MONO.toString(),
            mono_style_name: item.monoStyleName,
            mono_style_value: item.monoStyleValue.toString(),
            has_sten: item.has_STEN.toString(),
            stencil_style_name: item.stencilStyleName,
            stencil_style_value: item.stencilStyleValue.toString(),
            users_min: item.users[0].toString(),
            users_max: item.users[1].toString(),
            license: item.license,
            cart_key: item._key,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
      metadata: {
        cart_items_count: cartItems.length.toString(),
        total_amount: cartItems.reduce((sum, item) => sum + item.price, 0).toString(),
      },
      // Optional: Add customer information collection
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "FR",
          "DE",
          "IT",
          "ES",
          "NL",
          "BE",
          "CH",
          "AT",
          "SE",
          "NO",
          "DK",
          "FI",
        ],
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
