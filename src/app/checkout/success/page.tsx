"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

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
          <button className="font-whisper w-full rounded-full bg-black px-8 py-5 text-xl font-semibold text-white transition-colors hover:bg-gray-800">
            Download your fonts
          </button>
        </div>
      </div>
    </div>
  );
}
