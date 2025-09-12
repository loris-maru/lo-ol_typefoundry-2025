import { TypefaceSettings } from "@/types/playground";

export default function SelectionSettingMenu({
  settings,
  onClose,
}: {
  settings: TypefaceSettings;
  onClose?: () => void;
}) {
  const {
    wght,
    setWght,
    has_wdth,
    wdth,
    setWdth,
    has_slnt,
    slnt,
    setSlnt,
    has_opsz,
    opsz,
    setOpsz,
    has_italic,
    italic,
    setItalic,
  } = settings;

  return (
    <div
      className="absolute right-0 z-[99999] w-64 rounded-lg bg-white p-3 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
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
        <label className="block">
          <span className="mb-1 block font-sans">Weight ({wght})</span>
          <input
            type="range"
            min={100}
            max={900}
            step={1}
            value={wght}
            onChange={(e) => setWght(+e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full"
          />
        </label>
        {has_wdth && (
          <label className="block">
            <span className="mb-1 block font-sans">Width ({wdth})</span>
            <input
              type="range"
              min={100}
              max={900}
              step={1}
              value={wdth}
              onChange={(e) => setWdth(+e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full"
            />
          </label>
        )}
        {has_slnt && (
          <label className="block">
            <span className="mb-1 block font-sans">Slant ({slnt})</span>
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={slnt}
              onChange={(e) => setSlnt(+e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full"
            />
          </label>
        )}
        {has_opsz && (
          <label className="block">
            <span className="mb-1 block font-sans">Optical Size ({opsz})</span>
            <input
              type="range"
              min={100}
              max={900}
              step={1}
              value={opsz}
              onChange={(e) => setOpsz(+e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full"
            />
          </label>
        )}
        {has_italic && (
          <label className="flex flex-row items-start gap-2">
            <span className="mb-1 block font-sans">Italic</span>
            <input
              type="checkbox"
              checked={italic}
              onChange={(e) => {
                console.log("Italic checkbox changed:", e.target.checked);
                setItalic(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="relative top-1"
            />
          </label>
        )}
      </div>
    </div>
  );
}
