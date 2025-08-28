"use client";

import { WeightDef, WEIGHTS } from "@/app/content/WEIGHTS-LIST";
import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { useMemo, useState } from "react";
import WeightCard from "./card";

export default function WeightGrid({ content }: { content: typeface }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const hoveredCol = hovered === null ? null : hovered % 3;
  const hoveredRow = hovered === null ? null : Math.floor(hovered / 3);

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
  const fontFamily = slugify(content.name);

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-white">
      <div
        className="grid h-full w-full border border-white divide-x divide-y divide-white"
        style={{
          gridTemplateColumns: columns,
          gridTemplateRows: rows,
          transition:
            "grid-template-columns 600ms cubic-bezier(.2,.8,.2,1), grid-template-rows 600ms cubic-bezier(.2,.8,.2,1)",
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {WEIGHTS.map((card: WeightDef, idx: number) => (
          <WeightCard
            key={`${card.abbr}-${card.value}`}
            content={card}
            hasWidth={content.has_wdth}
            familyAbbreviation={familyAbbreviation}
            fontName={fontFamily}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            idx={idx}
          />
        ))}
      </div>
    </section>
  );
}
