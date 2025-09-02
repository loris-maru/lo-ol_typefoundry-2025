import { TypefaceSettings } from '@/types/playground';

export default function SettingMenu({ settings }: { settings: TypefaceSettings }) {
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
    lh,
    setLh,
  } = settings;

  return (
    <div className="absolute right-0 z-20 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
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
              className="w-full"
            />
          </label>
        )}
        {has_opsz && (
          <label className="block">
            <span className="mb-1 block font-sans">Optical Size ({opsz})</span>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={opsz}
              onChange={(e) => setOpsz(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {has_italic && (
          <label className="block">
            <span className="mb-1 block font-sans">Italic ({italic})</span>
            <input
              type="checkbox"
              checked={italic}
              onChange={(e) => setItalic(e.target.checked)}
              className="w-full"
            />
          </label>
        )}
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
      </div>
    </div>
  );
}
