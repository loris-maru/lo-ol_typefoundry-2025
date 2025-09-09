// Node runtime recommended (Stripe needs it)
export const runtime = 'nodejs';

import { CartPayload, CartSchema } from '@/lib/cart';
import { LicenseType, priceForItem, UserTier } from '@/lib/pricing';
import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' });

type TypefaceRow = {
  _id: string;
  name: string;
  pricePerFont: number;
  customFontPrice: number;
  variableFontPrice: number;
};

async function fetchTypefacesByNames(names: string[]): Promise<TypefaceRow[]> {
  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-08-01',
    useCdn: false,
  });
  
  const query = `*[_type == "typefaces" && name in $names]{ _id, name, pricePerFont, customFontPrice, variableFontPrice }`;
  return sanityClient.fetch<TypefaceRow[]>(query, { names });
}

function getFontStyleName(item: any): string {
  const parts = [];
  
  // Add weight name if available
  if (item.weight !== undefined) {
    const weightNames: Record<number, string> = {
      100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular', 500: 'Medium',
      600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black'
    };
    parts.push(weightNames[item.weight] || `Weight ${item.weight}`);
  }
  
  // Add width name if available
  if (item.width !== undefined) {
    const widthNames: Record<number, string> = {
      50: 'Ultra Condensed', 62.5: 'Extra Condensed', 75: 'Condensed', 87.5: 'Semi Condensed',
      100: 'Normal', 112.5: 'Semi Expanded', 125: 'Expanded', 150: 'Extra Expanded', 200: 'Ultra Expanded'
    };
    parts.push(widthNames[item.width] || `Width ${item.width}`);
  }
  
  // Add slant name if available
  if (item.slant !== undefined) {
    if (item.slant > 0) {
      parts.push('Italic');
    }
  }
  
  // Add optical size if available
  if (item.opticalSize !== undefined) {
    const opticalNames: Record<number, string> = {
      8: 'Caption', 10: 'Small Text', 12: 'Body', 14: 'Subheading', 16: 'Heading', 20: 'Display', 24: 'Large Display'
    };
    parts.push(opticalNames[item.opticalSize] || `Optical ${item.opticalSize}`);
  }
  
  // If no specific style parts, return a generic name
  if (parts.length === 0) {
    return 'Regular';
  }
  
  return parts.join(' ');
}

export async function POST(req: NextRequest) {
  try {
    console.log("=== CHECKOUT API START ===");
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const parsed = CartSchema.parse(body) as CartPayload;
    console.log("Parsed cart payload:", JSON.stringify(parsed, null, 2));

    const familyNames = Array.from(new Set(parsed.items.map(i => i.fontFamilyId)));
    console.log("Family names to fetch:", familyNames);
    
    const typefaces = await fetchTypefacesByNames(familyNames);
    console.log("Fetched typefaces:", JSON.stringify(typefaces, null, 2));
    
    const byTypeface: Record<string, TypefaceRow> = Object.fromEntries(typefaces.map(t => [t.name, t]));
    console.log("Typeface lookup map:", Object.keys(byTypeface));

    // Build validated line items and compute totals (server-authoritative)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let orderTotal = 0;

    for (const item of parsed.items) {
      console.log(`Processing item: ${item.fontId} (typeface: ${item.fontFamilyId})`);
      const typeface = byTypeface[item.fontFamilyId];
      if (!typeface) {
        console.error(`Unknown typeface ${item.fontFamilyId}. Available typefaces:`, Object.keys(byTypeface));
        throw new Error(`Unknown typeface ${item.fontFamilyId}`);
      }
      const basePrice = typeface.pricePerFont; // Use pricePerFont as the base price
      const amount = priceForItem(basePrice, item.licenseType as LicenseType, item.userTier as UserTier);
      console.log(`Item pricing: basePrice=${basePrice}, license=${item.licenseType}, tier=${item.userTier}, amount=${amount}`);

      orderTotal += amount * (item.qty ?? 1);

      // Stripe expects smallest currency unit (e.g. CHF cents)
      lineItems.push({
        quantity: item.qty ?? 1,
        price_data: {
          currency: 'chf',
          unit_amount: amount * 100,
          product_data: {
            name: `${typeface.name} – ${getFontStyleName(item)} (${item.licenseType}, ${item.userTier})`,
            metadata: {
              fontId: item.fontId,
              typefaceId: item.fontFamilyId,
              licenseType: item.licenseType,
              userTier: item.userTier,
            },
          },
        },
      });
    }

    console.log("Creating Stripe session with line items:", JSON.stringify(lineItems, null, 2));
    console.log("Total order amount:", orderTotal);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
      payment_method_types: ['card', 'paypal'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
        paypal: {
          // PayPal configuration
        },
      },
      metadata: {
        // Store a compact copy of the cart for webhook/fulfillment (optional; keep small)
        cartFingerprint: Buffer.from(JSON.stringify(parsed.items.map(i => ({
          f: i.fontId, FF: i.fontFamilyId, L: i.licenseType, T: i.userTier, q: i.qty ?? 1
        })))).toString('base64'),
      },
    });

    console.log("Stripe session created:", session.id);
    console.log("Stripe checkout URL:", session.url);
    return NextResponse.json({ 
      id: session.id, 
      url: session.url 
    });
  } catch (err: any) {
    console.error("=== CHECKOUT API ERROR ===");
    console.error("Error type:", err.constructor.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Full error object:", err);
    
    if (err instanceof z.ZodError) {
      console.error("Zod validation error:", err.issues);
      return NextResponse.json({ error: 'Invalid cart payload', details: err.issues }, { status: 400 });
    }
    
    // Return more specific error message
    const errorMessage = err.message || 'Checkout failed';
    return NextResponse.json({ error: errorMessage, details: err.message }, { status: 500 });
  }
}