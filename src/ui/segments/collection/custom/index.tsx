import { typeface } from "@/types/typefaces";
import TypeTesterCustomise from "@/ui/segments/collection/custom/type-tester";

export default function CustomGeneration({ content }: { content: typeface }) {
  return (
    <section
      className="relative z-40 min-h-screen w-screen bg-[#EFEFEF] p-8"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      <div className="font-whisper flex w-full flex-row justify-between text-base leading-none tracking-wide uppercase">
        <div className="block w-32">Choose your weight</div>
        <div className="block w-32">Your turn</div>
        <div className="block w-32">Test layouts</div>
      </div>
      <TypeTesterCustomise content={content} />
    </section>
  );
}
