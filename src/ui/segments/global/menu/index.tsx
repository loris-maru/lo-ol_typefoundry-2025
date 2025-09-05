"use client";

import Link from "next/link";

import { typeface } from "@/types/typefaces";

export default function MenuButton({ allTypefaces }: { allTypefaces: typeface[] }) {
  return (
    <div className="relative flex h-full w-full flex-row gap-x-8">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="text-lg font-medium text-white">About</div>
        <div className="text-lg font-medium text-white">Contact</div>
        <div className="text-lg font-medium text-white">Documentation</div>
        <div className="text-lg font-medium text-white">Shop</div>
        <div className="text-lg font-medium text-white">Cart</div>
      </div>
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {allTypefaces.map((typeface: typeface) => (
          <Link
            key={typeface.slug}
            href={`/collection/${typeface.slug}`}
            className="cursor-pointer transition-colors duration-200 hover:text-gray-300"
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
