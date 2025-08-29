import { singleFont } from "@/types/typefaces";

export default function SingleFontItem({
  content,
  familyName,
}: {
  content: singleFont;
  familyName: string;
}) {
  const itemFullName = `${familyName} ${content.weightName}`;

  return (
    <div className="relative w-full flex flex-row justify-between items-center text-white">
      <div className="text-2xl font-medium font-whisper">{itemFullName}</div>
      <div className="text-2xl font-medium font-whisper">
        {content.weightValue}
      </div>
    </div>
  );
}
