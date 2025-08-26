"use client";

import { PACKAGES } from "@/app/content/PACKAGES";
import { useInView } from "framer-motion";
import { useRef } from "react";
import PackageCard from "./card";

export default function ShopPackages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.6,
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] w-[100vw] flex bg-[#eaeaea] overflow-hidden"
    >
      {PACKAGES.map((pkg, idx) => (
        <PackageCard key={pkg.key} isInView={isInView} pkg={pkg} idx={idx} />
      ))}
    </section>
  );
}
