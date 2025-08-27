export default function SettingMenu({
  wght,
  setWght,
  wdth,
  setWdth,
  slnt,
  setSlnt,
  lh,
  setLh,
}: {
  wght: number;
  setWght: (value: number) => void;
  wdth: number;
  setWdth: (value: number) => void;
  slnt: number;
  setSlnt: (value: number) => void;
  lh: number;
  setLh: (value: number) => void;
}) {
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
