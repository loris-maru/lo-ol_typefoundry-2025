import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export default function TypeTesterCustomise({ content }: { content: typeface }) {
  return (
    <div
      className="flex w-full items-center justify-center bg-[#A8E2FB]"
      style={{ height: "60vh" }}
    >
      <h2
        className="text-center text-[9vw] leading-none font-black text-black"
        style={{
          fontFamily: slugify(content.name),
          fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
        }}
      >
        Customize
        <br />
        {content.name}
      </h2>
    </div>
  );
}
