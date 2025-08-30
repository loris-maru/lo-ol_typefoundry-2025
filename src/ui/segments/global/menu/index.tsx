"use client";

import { typeface } from "@/types/typefaces";
import Link from "next/link";

export default function MenuButton({
  allTypefaces,
}: {
  allTypefaces: typeface[];
}) {
  return (
    <div className="relative w-full h-full flex flex-row gap-x-8">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="text-lg text-white font-medium">About</div>
        <div className="text-lg text-white font-medium">Contact</div>
        <div className="text-lg text-white font-medium">Documentation</div>
        <div className="text-lg text-white font-medium">Shop</div>
        <div className="text-lg text-white font-medium">Cart</div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {allTypefaces.map((typeface: typeface) => (
          <Link
            key={typeface.slug}
            href={`/collection/${typeface.slug}`}
            className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
          >
            {typeface.name}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </div>
  );
}
