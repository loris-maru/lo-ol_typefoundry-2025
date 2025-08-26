import type { Card } from "./grid-block";

export default function WeightCard({
  content,
  onMouseEnter,
  onMouseLeave,
  idx,
}: {
  content: Card;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  idx: number;
}) {
  return (
    <div
      className="relative overflow-hidden p-6"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Card surface */}
      <div className="absolute inset-0 bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col">
        <div className="text-xs font-medium text-white">#{idx + 1}</div>
        <div className="mt-2 text-lg font-semibold">{content.title}</div>

        <div className="mt-auto">
          <p className="text-sm text-neutral-600">
            Hover to expand this card to{" "}
            <span className="font-medium">60vw × 50vh</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
