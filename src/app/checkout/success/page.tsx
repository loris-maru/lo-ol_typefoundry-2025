"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

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
          setMsg(data?.error || "Could not save your order.");
          return;
        }
        setMsg("Order saved in Sanity. Preparing your downloads…");
      } catch (e: any) {
        setMsg(e?.message ?? "Unexpected error");
      }
    };
    run();
  }, [sessionId]);

  return (
    // ...your existing JSX
    // optionally render {msg}
    <div className="text-center">
      {msg && <p className="mt-4 text-sm text-gray-600">{msg}</p>}
      {/* your buttons/links */}
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function CheckoutSuccess() {
//   const searchParams = useSearchParams();
//   const [sessionId, setSessionId] = useState<string | null>(null);

//   useEffect(() => {
//     const sessionIdParam = searchParams.get("session_id");
//     setSessionId(sessionIdParam);
//   }, [searchParams]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="mb-6">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//             <svg
//               className="h-6 w-6 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-green-600 mb-2">
//             Payment Successful!
//           </h1>
//           <p className="text-green-600">
//             Thank you for your purchase. Your fonts will be available for download shortly.
//           </p>
//         </div>

//         <div className="space-y-4">
//           <Link
//             href="/"
//             className="w-full bg-black text-white text-xl font-semibold py-5 px-8 rounded-full hover:bg-gray-800 transition-colors inline-block font-whisper"
//           >
//             Download fonts
//           </Link>
//           <Link
//             href="/cart"
//             className="text-black inline-block font-whisper text-base"
//           >
//             View Cart
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
