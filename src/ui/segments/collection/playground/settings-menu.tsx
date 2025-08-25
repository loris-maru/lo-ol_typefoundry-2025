import { TextBlock } from "@/types/collection";
import { RiListSettingsLine } from "react-icons/ri";

export default function SettingsMenu({
  showMenu,
  setShowMenu,
  block,
  onUpdate,
}: {
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
  block: TextBlock;
  onUpdate: (id: number, field: string, value: string | number) => void;
}) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-solid border-neutral-200 bg-[#F5F5F5]"
      >
        <RiListSettingsLine className="w-4 h-4 text-gray-600" />
      </button>

      {/* Settings menu */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg p-4 z-30">
          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="font-sans text-sm mb-1 block text-gray-700">
                Font Size ({block.fontSize}px)
              </span>
              <input
                type="range"
                min={12}
                max={48}
                step={1}
                value={block.fontSize}
                onChange={(e) =>
                  onUpdate(block.id, "fontSize", +e.target.value)
                }
                className="w-full"
              />
            </label>
            <label className="block">
              <span className="font-sans text-sm mb-1 block text-gray-700">
                Leading ({block.leading})
              </span>
              <input
                type="range"
                min={0.8}
                max={2.5}
                step={0.1}
                value={block.leading}
                onChange={(e) => onUpdate(block.id, "leading", +e.target.value)}
                className="w-full"
              />
            </label>
            <label className="block">
              <span className="font-sans text-sm mb-1 block text-gray-700">
                Weight ({block.weight})
              </span>
              <input
                type="range"
                min={100}
                max={900}
                step={1}
                value={block.weight}
                onChange={(e) => onUpdate(block.id, "weight", +e.target.value)}
                className="w-full"
              />
            </label>
            <label className="block">
              <span className="font-sans text-sm mb-1 block text-gray-700">
                Width ({block.width})
              </span>
              <input
                type="range"
                min={100}
                max={900}
                step={1}
                value={block.width}
                onChange={(e) => onUpdate(block.id, "width", +e.target.value)}
                className="w-full"
              />
            </label>
            <label className="block">
              <span className="font-sans text-sm mb-1 block text-gray-700">
                Slant ({block.slant}°)
              </span>
              <input
                type="range"
                min={-12}
                max={0}
                step={1}
                value={block.slant}
                onChange={(e) => onUpdate(block.id, "slant", +e.target.value)}
                className="w-full"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
