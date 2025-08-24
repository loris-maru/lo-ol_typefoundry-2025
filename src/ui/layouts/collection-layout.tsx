import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Type Foundry — Single Typeface",
  description: "Scroll-driven type specimen with video hero and playground",
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
