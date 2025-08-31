"use client";

import { typeface } from "@/types/typefaces";
import Footer from "@/ui/segments/global/footer";
import CollectionsList from "@/ui/segments/home/collections-list";
import HeroSection from "@/ui/segments/home/hero-section";

interface HomePageProps {
  typefaces: typeface[];
}

export default function HomePage({ typefaces }: HomePageProps) {
  return (
    <main className="relative w-full">
      <HeroSection typefaces={typefaces} />
      <CollectionsList typefaces={typefaces} />
      <Footer />
    </main>
  );
}
