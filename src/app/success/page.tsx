"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OrderedFont } from "@/types/order";

export default function SuccessPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id"); // Stripe Checkout attaches this
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: Build this array from your cart/order state you persisted pre-checkout
  const orderedFonts: OrderedFont[] = [
    // example:
    // {
    //   fontID: "fuzar-black",
    //   fontFamilyID: "fuzar",
    //   license: "webAndDesktop",
    //   weight: 900,
    //   width: null,
    //   slant: 0,
    //   opticalSize: null,
    //   isItalic: false,
    //   specimen: "specimens/Fuzar.pdf",
    //   eula: "eulas/LO-OL-EULA.pdf",
    // },
  ];

  const handleDownload = useCallback(async () => {
    if (!sessionId) {
      setError("Missing Stripe session_id in URL.");
      return;
    }
    if (orderedFonts.length === 0) {
      setError("No items in the order payload.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const res = await fetch("/api/orders/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, items: orderedFonts }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Failed with ${res.status}`);
      }

      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, orderedFonts]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Payment successful ✅</h1>
      <p className="mt-2 text-sm text-white/70">
        Your fonts are being prepared. Click the button below to generate the package.
      </p>

      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="mt-6 rounded-full border border-white px-6 py-3 text-sm font-medium tracking-wider uppercase disabled:opacity-60"
      >
        {isLoading ? "Preparing…" : "Download file"}
      </button>

      {downloadUrl && (
        <a className="mt-4 block underline" href={downloadUrl} rel="noopener noreferrer">
          Download your package (ZIP)
        </a>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </main>
  );
}

// "use client";

// import { Suspense, useEffect, useState } from "react";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// import { useCartStore } from "@/states/cart";

// function SuccessPageContent() {
//   const [sessionData, setSessionData] = useState<{
//     amount_total: number;
//     customer_details?: { email: string };
//     metadata?: { cart_items_count: string };
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const searchParams = useSearchParams();
//   const { clearCart } = useCartStore();

//   const sessionId = searchParams.get("session_id");

//   useEffect(() => {
//     const run = async () => {
//       if (!sessionId) {
//         console.log("[success] No session_id in URL");
//         return;
//       }

//       const res = await fetch("/api/orders/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });
//       const json = await res.json();
//     };
//     run();
//   }, [sessionId]);

//   useEffect(() => {
//     if (sessionId) {
//       // Fetch session details from your backend
//       fetch(`/api/checkout/session?session_id=${sessionId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.error) {
//             setError(data.error);
//           } else {
//             setSessionData(data);
//             // Clear cart on successful payment
//             clearCart();
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching session:", err);
//           setError("Failed to verify payment");
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, [sessionId, clearCart]);

//   if (loading) {
//     return (
//       <main className="mx-auto max-w-xl p-8 text-center">
//         <div className="flex items-center justify-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
//           <span className="ml-2">Verifying payment...</span>
//         </div>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="mx-auto max-w-xl p-8 text-center">
//         <h1 className="text-2xl font-semibold text-red-600">Payment Verification Failed</h1>
//         <p className="mt-2 opacity-80">{error}</p>
//         <p className="mt-4 text-sm opacity-60">
//           If you believe this is an error, please contact support with your session ID: {sessionId}
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="mx-auto max-w-xl p-8 text-center">
//       <h1 className="text-2xl font-semibold">Thanks! 🎉</h1>
//       <p className="mt-2 opacity-80">Your payment was successful.</p>

//       {sessionData && (
//         <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left">
//           <h2 className="mb-2 font-semibold">Purchase Details:</h2>
//           <p className="text-sm opacity-80">
//             <strong>Amount:</strong> ${(sessionData.amount_total / 100).toFixed(2)}
//           </p>
//           <p className="text-sm opacity-80">
//             <strong>Email:</strong> {sessionData.customer_details?.email}
//           </p>
//           {sessionData.metadata && (
//             <p className="text-sm opacity-80">
//               <strong>Items:</strong> {sessionData.metadata.cart_items_count} font(s)
//             </p>
//           )}
//         </div>
//       )}

//       <div className="mt-6 space-y-2">
//         <p className="text-sm opacity-60">
//           You will receive a confirmation email shortly with your font licenses and download links.
//         </p>
//         <Link
//           href="/"
//           className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     </main>
//   );
// }

// export default function SuccessPage() {
//   return (
//     <Suspense
//       fallback={
//         <main className="mx-auto max-w-xl p-8 text-center">
//           <div className="flex items-center justify-center">
//             <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
//             <span className="ml-2">Loading...</span>
//           </div>
//         </main>
//       }
//     >
//       <SuccessPageContent />
//     </Suspense>
//   );
// }
