import { TypefaceSettings } from "@/types/playground";

export default function SettingMenu({
  settings,
  onClose,
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  paddingTop,
  setPaddingTop,
  paddingRight,
  setPaddingRight,
  paddingBottom,
  setPaddingBottom,
  paddingLeft,
  setPaddingLeft,
}: {
  settings: TypefaceSettings;
  onClose?: () => void;
  textColor?: string;
  setTextColor?: (color: string) => void;
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
  paddingTop?: number;
  setPaddingTop?: (value: number) => void;
  paddingRight?: number;
  setPaddingRight?: (value: number) => void;
  paddingBottom?: number;
  setPaddingBottom?: (value: number) => void;
  paddingLeft?: number;
  setPaddingLeft?: (value: number) => void;
}) {
  const { lh, setLh } = settings;

  return (
    <div className="absolute right-0 z-20 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close settings menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <div className="space-y-3 text-sm font-normal">
        <div className="mb-2 text-xs font-medium tracking-wider text-gray-600 uppercase">
          Block Settings
        </div>
        <label className="block">
          <span className="mb-1 block font-sans">Line Height ({lh})</span>
          <input
            type="range"
            min={0.8}
            max={2.5}
            step={0.1}
            value={lh}
            onChange={(e) => setLh(+e.target.value)}
            className="w-full"
          />
        </label>
        {setTextColor && (
          <label className="block">
            <span className="mb-1 block font-sans">Text Color</span>
            <input
              type="color"
              value={textColor || "#000000"}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-full rounded border border-gray-300"
            />
          </label>
        )}
        {setBackgroundColor && (
          <label className="block">
            <span className="mb-1 block font-sans">Background Color</span>
            <input
              type="color"
              value={backgroundColor || "transparent"}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-8 w-full rounded border border-gray-300"
            />
          </label>
        )}
        {setPaddingTop && (
          <label className="block">
            <span className="mb-1 block font-sans">Padding Top ({paddingTop}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingTop || 0}
              onChange={(e) => setPaddingTop(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingRight && (
          <label className="block">
            <span className="mb-1 block font-sans">Padding Right ({paddingRight}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingRight || 0}
              onChange={(e) => setPaddingRight(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingBottom && (
          <label className="block">
            <span className="mb-1 block font-sans">Padding Bottom ({paddingBottom}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingBottom || 0}
              onChange={(e) => setPaddingBottom(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingLeft && (
          <label className="block">
            <span className="mb-1 block font-sans">Padding Left ({paddingLeft}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingLeft || 0}
              onChange={(e) => setPaddingLeft(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
      </div>
    </div>
  );
}
