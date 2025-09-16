import { RiAlignCenter, RiAlignLeft, RiAlignRight } from "react-icons/ri";

import { GlobalSettingsProps } from "@/types/custom-type-tester";
import CustomFontSettings from "@/ui/segments/collection/custom/custom-font-settings";
import InputTextColor from "@/ui/segments/collection/custom/input-text-color";
import InputBackground from "@/ui/segments/collection/custom/inputs-background";

export default function GlobalSettings({ content, text, background, font }: GlobalSettingsProps) {
  return (
    <div className="flex h-[60vh] flex-col justify-between gap-4">
      <div
        id="global-settings-container"
        className="font-whisper pointer-events-auto relative z-30 flex w-full flex-row items-start justify-between text-sm tracking-wider uppercase"
      >
        <InputTextColor value={text.color} onChange={text.setColor} />

        {/* Text Alignment Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => text.setAlign("left")}
            className={`rounded p-2 transition-colors duration-200 ${
              text.align === "left"
                ? "bg-black text-white"
                : "bg-transparent text-black hover:bg-gray-100"
            }`}
            aria-label="Align text left"
          >
            <RiAlignLeft size={16} />
          </button>
          <button
            onClick={() => text.setAlign("center")}
            className={`rounded p-2 transition-colors duration-200 ${
              text.align === "center"
                ? "bg-black text-white"
                : "bg-transparent text-black hover:bg-gray-100"
            }`}
            aria-label="Align text center"
          >
            <RiAlignCenter size={16} />
          </button>
          <button
            onClick={() => text.setAlign("right")}
            className={`rounded p-2 transition-colors duration-200 ${
              text.align === "right"
                ? "bg-black text-white"
                : "bg-transparent text-black hover:bg-gray-100"
            }`}
            aria-label="Align text right"
          >
            <RiAlignRight size={16} />
          </button>
        </div>
        <InputBackground
          type={background.type as "image" | "color"}
          colorValue={background.color}
          textColor={text.color}
          backgroundImageValue={background.image}
          onTypeChange={background.setType}
          onColorChange={background.setColor}
          onImageChange={(image: string | null) => {
            if (image) background.setImage(image);
          }}
        />
      </div>
      <div className="pointer-events-auto relative z-30">
        <CustomFontSettings
          lineHeight={font.lineHeight}
          weight={font.weight}
          width={font.width}
          slant={font.slant}
          italic={font.italic}
          opticalSize={font.opticalSize}
          textColor={text.color}
          content={content}
        />
      </div>
    </div>
  );
}
