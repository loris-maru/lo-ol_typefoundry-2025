import { typeface } from "@/types/typefaces";
import FontList from "@/ui/segments/collection/story/font-list";
import Introduction from "@/ui/segments/collection/story/introduction";
import slugify from "@/utils/slugify";

export default function StoryContent({ content }: { content: typeface }) {
  return (
    <div className="relative flex h-screen w-screen flex-col justify-between bg-black p-8 text-white">
      <Introduction content={content.introduction[0].value} familyName={slugify(content.name)} />
      <FontList singleFontList={content.singleFontList} />
    </div>
  );
}
