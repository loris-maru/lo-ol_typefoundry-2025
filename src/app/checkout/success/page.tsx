"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { OrderedFont } from "@/types/order";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(searchParams.get("session_id"));
  }, [searchParams]);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok || data?.error) {
          throw new Error(data?.error || "Could not save your order.");
          return;
        }
        throw new Error("Order saved in Sanity. Preparing your downloads…");
      } catch (e: any) {
        throw new Error(e?.message ?? "Unexpected error");
      }
    };
    run();
  }, [sessionId]);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          {/* Check Animation */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 animate-pulse text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Payment Successful Text */}
          <h1 className="font-whisper mb-4 text-3xl font-bold text-green-600">
            Payment successful
          </h1>
        </div>

        {/* Download Button */}
        <div className="space-y-4">
          <button
            type="button"
            aria-label="Download file"
            onClick={handleDownload}
            disabled={isLoading}
            className="mt-6 rounded-full border border-white px-6 py-3 text-sm font-medium tracking-wider uppercase disabled:opacity-60"
          >
            {isLoading ? "Preparing…" : "Download file"}
          </button>
        </div>
      </div>
    </div>
  );
}
