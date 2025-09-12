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
  const [orderError, setOrderError] = useState<string | null>(null);

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
        // Order saved successfully, show success message
        console.log("Order saved in Sanity. Preparing your downloads…");
      } catch (e: any) {
        throw new Error(e?.message ?? "Unexpected error");
      }
    };
    run();
  }, [sessionId]);

  // Fetch order data from Sanity
  const [orderedFonts, setOrderedFonts] = useState<OrderedFont[]>([]);
  const [orderLoaded, setOrderLoaded] = useState(false);

  // Fetch order data when component mounts with retry logic
  useEffect(() => {
    if (!sessionId) return;

    const fetchOrderData = async (retryCount = 0) => {
      try {
        console.log(`Fetching order data (attempt ${retryCount + 1})...`);
        const res = await fetch(`/api/orders/by-session?sessionId=${sessionId}`);

        if (res.ok) {
          const orderData = await res.json();
          console.log("Order data received:", orderData);

          if (orderData.items && orderData.items.length > 0) {
            // Convert order items to OrderedFont format
            const fonts: OrderedFont[] = orderData.items.map((item: any) => {
              // Slugify the fontFamilyId to match R2 bucket structure
              const slugifiedFamilyId = item.fontFamilyId
                ? item.fontFamilyId
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                : "unknown-family";

              console.log(`Converting family: "${item.fontFamilyId}" -> "${slugifiedFamilyId}"`);

              return {
                fontID: item.fontId,
                fontFamilyID: slugifiedFamilyId,
                license: item.licenseType,
                weight: item.weight,
                width: item.width,
                slant: item.slant,
                opticalSize: item.opticalSize,
                isItalic: item.isItalic,
                specimen: "", // Will be filled by the generate API
                eula: "", // Will be filled by the generate API
              };
            });
            setOrderedFonts(fonts);
            setOrderLoaded(true);
            return;
          }
        }

        // If order not found and we haven't retried too many times, retry
        if (retryCount < 8) {
          // Increased from 5 to 8 retries
          const delay = Math.min((retryCount + 1) * 1500, 10000); // Max 10 seconds delay
          console.log(`Order not found, retrying in ${delay}ms...`);
          setTimeout(() => fetchOrderData(retryCount + 1), delay);
        } else {
          console.error("Order not found after 8 retries");
          setOrderError("Order not found. Please try refreshing the page.");
          setOrderLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch order data:", error);
        setOrderError("Failed to load order data. Please try refreshing the page.");
        setOrderLoaded(true);
      }
    };

    fetchOrderData();
  }, [sessionId]);

  const handleDownload = useCallback(async () => {
    console.log("=== DOWNLOAD BUTTON CLICKED ===");
    console.log("Session ID:", sessionId);
    console.log("Ordered fonts:", orderedFonts);
    console.log("Order loaded:", orderLoaded);
    console.log("Ordered fonts length:", orderedFonts.length);
    console.log(
      "Ordered fonts details:",
      orderedFonts.map((f) => ({
        fontID: f.fontID,
        fontFamilyID: f.fontFamilyID,
        license: f.license,
      })),
    );

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
      console.log("Calling /api/orders/generate with:", { sessionId, items: orderedFonts });
      console.log(
        "OrderedFonts details:",
        orderedFonts.map((f) => ({
          fontFamilyID: f.fontFamilyID,
          fontID: f.fontID,
          license: f.license,
        })),
      );

      const res = await fetch("/api/orders/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, items: orderedFonts }),
      });

      console.log("Generate API response status:", res.status);

      if (!res.ok) {
        const msg = await res.text();
        console.error("Generate API error:", msg);
        throw new Error(msg || `Failed with ${res.status}`);
      }

      const data = await res.json();
      console.log("Download URL received:", data.downloadUrl);
      setDownloadUrl(data.downloadUrl);

      // Automatically trigger download when URL is received
      if (data.downloadUrl) {
        console.log("Triggering automatic download...");
        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = `font-order-${sessionId}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e: any) {
      console.error("Download error:", e);
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, orderedFonts, orderLoaded]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
      <div className="relative text-center">
        <div className="mb-8">
          {/* Check Animation */}
          <div className="mx-auto mb-1 flex h-24 w-24 items-center justify-center rounded-full bg-green-600">
            <svg
              className="h-12 w-12 animate-pulse text-white"
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
          <h1 className="font-whisper text-lg font-medium text-green-600">Payment successful</h1>
        </div>

        {/* Download Button */}
        <div className="relative space-y-4">
          <button
            id="download-button"
            type="button"
            aria-label="Download file"
            onClick={handleDownload}
            disabled={isLoading || !orderLoaded || orderedFonts.length === 0}
            className="font-whisper relative mt-6 cursor-pointer rounded-full border-[2px] border-black px-20 py-6 text-3xl font-medium disabled:opacity-60"
          >
            <span className="relative top-0.5 block">
              {!orderLoaded ? "Loading order..." : isLoading ? "Preparing…" : "Download file"}
            </span>
          </button>
        </div>

        {/* Error Messages */}
        {error && <p className="mt-4 text-red-400">{error}</p>}
        {orderError && <p className="mt-4 text-red-400">{orderError}</p>}
      </div>
    </div>
  );
}
