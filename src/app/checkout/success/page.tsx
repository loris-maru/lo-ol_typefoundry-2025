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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          {/* Check Animation */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600 animate-pulse"
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
          <h1 className="text-3xl font-bold text-green-600 mb-4 font-whisper">
            Payment successful
          </h1>
          
        </div>

        {/* Download Button */}
        <div className="space-y-4">
          <button className="w-full bg-black text-white text-xl font-semibold py-5 px-8 rounded-full hover:bg-gray-800 transition-colors font-whisper">
            Download your fonts
          </button>
        </div>
      </div>
    </div>
  );
}
