import { typeface } from "@/types/typefaces";

export default function StoryBackground({ content }: { content: typeface }) {
  return (
    <>
      <aside className="font-whisper relative z-10 flex w-full flex-row justify-between px-8 text-xl leading-none font-medium tracking-[0.015em] uppercase">
        <div>
          A serif
          <br />
          typeface
        </div>
        <div>2025</div>
        <div>
          Nine
          <br />
          Weights
        </div>
      </aside>
      <div className="font-mayday absolute top-[40px] left-0 z-0 flex h-full w-full items-center justify-center text-[32vw] tracking-[-0.04em] text-neutral-200 uppercase">
        <div>Story</div>
      </div>
    </>
  );
}
