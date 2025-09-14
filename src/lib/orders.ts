import { createClient } from "@sanity/client";
import Stripe from "stripe";
import slugify from "@/utils/slugify";

// Use test key for development, fallback to live key
const stripeKey = process.env.STRIPE_SECRET_KEY_DEV || process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  throw new Error("No Stripe secret key found (STRIPE_SECRET_KEY_DEV or STRIPE_SECRET_KEY)");
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-08-27.basil",
});

export const sanityWrite = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN!, // PAT with write scope
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

console.log("=== SANITY WRITE CLIENT CONFIG ===");
console.log("Project ID:", process.env.SANITY_PROJECT_ID);
console.log("Dataset:", process.env.SANITY_DATASET);
console.log("API Version:", process.env.SANITY_API_VERSION || "2025-01-01");
console.log("Has Write Token:", !!process.env.SANITY_WRITE_TOKEN);

export async function upsertOrderFromCheckoutSession(sessionId: string) {
  console.log("=== UPSERT ORDER FROM CHECKOUT SESSION ===");
  console.log("Session ID:", sessionId);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  console.log("Session payment status:", session.payment_status);
  console.log("Session amount total:", session.amount_total);

  if (session.payment_status !== "paid") {
    throw new Error("Checkout Session is not paid yet.");
  }

  // Build items[] to match your schema
  const items = (session.line_items?.data ?? []).map((li) => {
    const price = li.price as Stripe.Price | null | undefined;
    const product = (price?.product as Stripe.Product | string | undefined) ?? undefined;

    const pmeta = price?.metadata ?? {};
    const prodmeta = (typeof product === "string" ? {} : (product?.metadata ?? {})) ?? {};

    console.log("Stripe metadata for item:", {
      priceMetadata: pmeta,
      productMetadata: prodmeta,
      productName: typeof product === "string" ? product : product?.name,
    });

    const read = (k: string) => (prodmeta as any)[k] ?? (pmeta as any)[k];

    const typefaceId = read("typefaceId") ?? null;
    const fontId = read("fontId") ?? null;

    return {
      fontId: fontId,
      fontFamilyId: typefaceId ? slugify(typefaceId) : null, // Slugify the typeface name
      licenseType: read("licenseType") ?? null,
      userTier: read("userTier") ?? null,
      qty: li.quantity ?? 1,
      weight: numOr(read("weight"), 400),
      width: numOr(read("width"), 100),
      slant: numOr(read("slant"), 0),
      opticalSize: numOr(read("opticalSize"), 100),
      isItalic: toBool(read("isItalic")),
    };
  });

  const docId = `order.${session.id}`; // idempotent
  const doc = {
    _id: docId,
    _type: "order",
    _key: `order-${session.id.replace("cs_test_", "").replace("cs_live_", "")}`, // unique key for the order
    stripeSessionId: session.id,
    status: "paid",
    email: session.customer_details?.email || session.customer_email || "",
    // store minor units or change to /100 if you prefer major units
    totalPaid: session.amount_total ?? 0,
    items,
    downloadUrl: null as string | null,
    expiresAt: null as string | null,
    artifacts: [] as any[],
  };

  console.log("Creating order document:", JSON.stringify(doc, null, 2));

  const existingId = await sanityWrite.fetch<string | null>(
    '*[_type == "order" && stripeSessionId == $id][0]._id',
    { id: session.id },
  );

  if (existingId) {
    console.log("Updating existing order:", existingId);
    await sanityWrite.patch(existingId).set(doc).commit();
    return existingId;
  } else {
    console.log("Creating new order document");
    const created = await sanityWrite.createIfNotExists(doc);
    console.log("Order created with ID:", created._id);
    return created._id as string;
  }
}

// small helpers
function numOr(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function toBool(v: unknown) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  if (typeof v === "number") return v !== 0;
  return false;
}

// Optional alias if other files still import the old name:
export { upsertOrderFromCheckoutSession as createOrderFromSession };

// // src/lib/orders.ts
// import { createClient } from "@sanity/client";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// // Server-only Sanity client with write permissions
// export const sanityWrite = createClient({
//   projectId: process.env.SANITY_PROJECT_ID!,
//   dataset: process.env.SANITY_DATASET!,
//   apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
//   token: process.env.SANITY_WRITE_TOKEN!, // PAT with write access
//   useCdn: false,
//   ignoreBrowserTokenWarning: true,
// });

// // Idempotently create/update an order from a Stripe Checkout Session
// export async function upsertOrderFromCheckoutSession(sessionId: string) {
//   const session = await stripe.checkout.sessions.retrieve(sessionId, {
//     expand: ["line_items.data.price.product"],
//   });

//   if (session.payment_status !== "paid") {
//     throw new Error("Checkout Session is not paid yet.");
//   }

//   // Build items[] to match your schema
//   const items =
//     (session.line_items?.data ?? []).map((li) => {
//       const price = li.price as Stripe.Price | null | undefined;
//       const product =
//         (price?.product as Stripe.Product | string | undefined) ?? undefined;

//       // Put your font metadata on Stripe Product/Price metadata
//       const pmeta = price?.metadata ?? {};
//       const prodmeta =
//         (typeof product === "string" ? {} : product?.metadata ?? {}) ?? {};

//       const read = (k: string) => (prodmeta as any)[k] ?? (pmeta as any)[k];

//       return {
//         _type: "object", // Sanity inline object
//         fontId: read("fontId") ?? null,
//         fontFamilyId: read("fontFamilyId") ?? null,
//         licenseType: read("licenseType") ?? null,
//         userTier: read("userTier") ?? null,
//         qty: li.quantity ?? 1,
//         weight: numberOrNull(read("weight"), 400),
//         width: numberOrNull(read("width"), 100),
//         slant: numberOrNull(read("slant"), 0),
//         opticalSize: numberOrNull(read("opticalSize"), 100),
//         isItalic: toBoolean(read("isItalic")),
//       };
//     }) ?? [];

//   const docId = `order.${session.id}`; // idempotency key

//   // NOTE on money: Stripe uses minor units (e.g., cents). Your schema uses a plain number.
//   // We store minor units as-is to avoid rounding surprises. If you'd rather store major units,
//   // change to: totalPaid: (session.amount_total ?? 0) / 100
//   const baseDoc = {
//     _id: docId,
//     _type: "order",
//     stripeSessionId: session.id,
//     status: "paid", // your schema's list: pending | paid | fulfilled | failed
//     email: session.customer_details?.email || session.customer_email || null,
//     totalPaid: session.amount_total ?? 0, // minor units; see note above
//     items,
//     // You can fill these later when your generator finishes:
//     downloadUrl: null as string | null,
//     expiresAt: null as string | null,
//     artifacts: [] as any[],
//   };

//   // If order exists, patch; otherwise create
//   const existingId = await sanityWrite.fetch<string | null>(
//     '*[_type == "order" && stripeSessionId == $id][0]._id',
//     { id: session.id }
//   );

//   if (existingId) {
//     await sanityWrite.patch(existingId).set(baseDoc).commit();
//     return existingId;
//   } else {
//     const created = await sanityWrite.createIfNotExists(baseDoc);
//     return created._id as string;
//   }
// }

// // helpers
// function numberOrNull(v: unknown, fallback: number): number | null {
//   if (v === undefined || v === null || v === "") return fallback;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }
// function toBoolean(v: unknown): boolean {
//   if (typeof v === "boolean") return v;
//   if (typeof v === "string") return v.toLowerCase() === "true";
//   if (typeof v === "number") return v !== 0;
//   return false;
// }

// // Optional compatibility export if other files still import the old name
// export { upsertOrderFromCheckoutSession as createOrderFromSession };

export async function markOrderFulfilled(orderId: string, downloadUrl: string, expiresAt: string) {
  try {
    console.log(`Marking order ${orderId} as fulfilled`);

    const result = await sanityWrite(async (client) => {
      return await client
        .patch(orderId)
        .set({
          downloadUrl,
          expiresAt,
          status: "fulfilled",
        })
        .commit();
    });

    console.log(`Order ${orderId} marked as fulfilled`);
    return result;
  } catch (error) {
    console.error(`Error marking order ${orderId} as fulfilled:`, error);
    throw error;
  }
}
