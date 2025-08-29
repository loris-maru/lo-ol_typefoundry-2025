"use client";

import { WeightDef, WEIGHTS } from "@/app/content/WEIGHTS-LIST";
import { typeface } from "@/types/typefaces";
import WeightCard from "@/ui/segments/collection/weight-grid/card";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function WeightGrid({ content }: { content: typeface }) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Columns: default 33.333% each; hovered column becomes 60%, others 20%
  const columns = useMemo(() => {
    if (hoveredCol === null) return "33.3333% 33.3333% 33.3333%";
    const w = ["20%", "20%", "20%"];
    w[hoveredCol] = "60%";
    return w.join(" ");
  }, [hoveredCol]);

  // Rows: default 33.333% each; hovered row becomes 50%, others 25%
  const rows = useMemo(() => {
    if (hoveredRow === null) return "33.3333% 33.3333% 33.3333%";
    const h = ["25%", "25%", "25%"];
    h[hoveredRow] = "50%";
    return h.join(" ");
  }, [hoveredRow]);

  const familyAbbreviation = content.name.slice(0, 2);

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <motion.div
        className="relative w-full h-full grid gap-0"
        style={{
          gridTemplateColumns: columns,
          gridTemplateRows: rows,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {WEIGHTS.map((weight: WeightDef, index: number) => (
          <WeightCard
            key={weight.name}
            card={weight}
            content={content}
            familyAbbreviation={familyAbbreviation}
            idx={index}
            onMouseEnter={() => {
              const col = index % 3;
              const row = Math.floor(index / 3);
              setHoveredCol(col);
              setHoveredRow(row);
            }}
            onMouseLeave={() => {
              setHoveredCol(null);
              setHoveredRow(null);
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
