"use client";

import { useMemo, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";

type LicenseType = "Web" | "Print" | "WebAndPrint";
type OrderedFont = {
  fontID: string;
  fontFamilyID: string;
  license: LicenseType;
  weight: number;
  width: number | null;
  slant: number | null;
  opticalSize: number | null;
  isItalic: boolean;
  specimen: string; // can be ""
  eula: string; // can be ""
};

function SuccessPageContent() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id"); // from Stripe redirect
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: build from your persisted cart/order (this is just an example)
  const items: OrderedFont[] = useMemo(
    () => [
      // {
      //   fontID: "banya-mist-sc0yjfnn-20250912091948",
      //   fontFamilyID: "banya-mist",
      //   license: "Web",
      //   weight: 400,
      //   width: 100,
      //   slant: 0,
      //   opticalSize: 100,
      //   isItalic: false,
      //   specimen: "",
      //   eula: "",
      // },
    ],
    [],
  );

  async function handleDownload() {
    setError(null);
    setDownloadUrl(null);

    if (!sessionId) {
      setError("Missing ?session_id from Stripe redirect.");
      return;
    }
    if (!items.length) {
      setError("No items to generate.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, items }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { downloadUrl } = await res.json();
      setDownloadUrl(downloadUrl);
      // Optional: auto-redirect:
      // window.location.href = downloadUrl;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate order.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Payment successful ✅</h1>
      <p className="mt-2 text-sm text-white/70">Click below to generate and download your order.</p>

      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="mt-6 rounded-full border border-white px-6 py-3 tracking-wider uppercase disabled:opacity-60"
      >
        {isLoading ? "Preparing…" : "Download Order"}
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

function LoadingFallback() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Loading...</h1>
      <div className="mt-2 animate-pulse">
        <div className="h-4 w-64 bg-gray-300 rounded"></div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessPageContent />
    </Suspense>
  );
}
