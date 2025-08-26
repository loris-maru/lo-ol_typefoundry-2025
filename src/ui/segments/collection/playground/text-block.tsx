import { useState } from "react";
import { TextBlock as TextBlockType } from "../../../../states/playground";
import SettingsMenu from "./settings-menu";

interface TextBlockProps {
  block: TextBlockType;
  onUpdate: (id: number, field: string, value: string | number) => void;
}

export default function TextBlock({ block, onUpdate }: TextBlockProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Get column classes based on block columns
  const getColumnClasses = () => {
    switch (block.columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  // Create text content for each column
  const getColumnContent = () => {
    if (block.columns === 1) {
      return [block.text];
    } else if (block.columns === 2) {
      // Split text into two parts for 2 columns
      const words = block.text.split(" ");
      const midPoint = Math.ceil(words.length / 2);
      return [
        words.slice(0, midPoint).join(" "),
        words.slice(midPoint).join(" "),
      ];
    } else if (block.columns === 3) {
      // Split text into three parts for 3 columns
      const words = block.text.split(" ");
      const partSize = Math.ceil(words.length / 3);
      return [
        words.slice(0, partSize).join(" "),
        words.slice(partSize, partSize * 2).join(" "),
        words.slice(partSize * 2).join(" "),
      ];
    }
    return [block.text];
  };

  const columnContent = getColumnContent();

  return (
    <div className="relative">
      {/* Settings button - positioned upper right */}
      <SettingsMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        block={block}
        onUpdate={onUpdate}
      />
      {/* Text content in columns */}
      <div className={`grid ${getColumnClasses()} gap-6`}>
        {columnContent.map((text, index) => (
          <div key={index} className="min-h-0">
            <textarea
              value={text}
              onChange={(e) => {
                const newContent = [...columnContent];
                newContent[index] = e.target.value;
                onUpdate(block.id, "text", newContent.join(" "));
              }}
              className="w-full h-auto resize-none border-none outline-none font-fuzar overflow-hidden"
              style={{
                fontSize: `${block.fontSize}px`,
                lineHeight: block.leading,
                fontVariationSettings: `'wght' ${block.weight}, 'wdth' ${block.width}, 'slnt' ${block.slant}`,
              }}
              rows={Math.max(3, Math.ceil(text.length / 50))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
