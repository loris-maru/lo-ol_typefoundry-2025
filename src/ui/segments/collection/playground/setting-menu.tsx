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
    <div className="absolute right-4 top-14 z-20 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
      <div className="space-y-3 text-sm">
        <label className="block">
          <span className="mb-1 block">Weight ({wght})</span>
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
          <span className="mb-1 block">Width ({wdth})</span>
          <input
            type="range"
            min={75}
            max={125}
            step={1}
            value={wdth}
            onChange={(e) => setWdth(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Slant ({slnt})</span>
          <input
            type="range"
            min={-12}
            max={0}
            step={1}
            value={slnt}
            onChange={(e) => setSlnt(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Line Height ({lh})</span>
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
