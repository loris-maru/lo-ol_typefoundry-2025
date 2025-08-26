import { WeightDef } from "@/app/content/WEIGHTS-LIST";

export default function WeightCard({
  content,
  onMouseEnter,
  onMouseLeave,
  idx,
}: {
  content: WeightDef;
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
      <div className="relative z-10 h-full w-full flex flex-col justify-between text-white">
        <div>
          <div className="w-full flex flex-row gap-x-2">
            <div
              className="text-6xl w-36 h-36 rounded-full border border-solid border-white flex items-center justify-center"
              style={{ fontVariationSettings: `'wght' ${content.value}` }}
            >
              {content.abbr}
            </div>
            <div
              className="text-6xl w-36 h-36 rounded-full bg-white text-black flex items-center justify-center"
              style={{ fontVariationSettings: `'wght' ${content.value}` }}
            >
              Fu
            </div>
          </div>
          <div className="relative -top-4 text-[5.5vw]">
            <span className="inline-block mr-6">{content.name}</span>
            <span>{content.value}</span>
          </div>
        </div>

        <div>
          <div className="text-base font-medium">#{idx + 1}</div>
        </div>
      </div>
    </div>
  );
}
