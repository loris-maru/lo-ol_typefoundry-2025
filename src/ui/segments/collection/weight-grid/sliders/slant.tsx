export default function SlantSlider({
  slantValue,
  setSlantValue,
  slantSettings,
}: {
  slantValue: number;
  setSlantValue: (value: number) => void;
  slantSettings: {
    min: number;
    max: number;
    step: number;
    value: number;
  };
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-sm text-white/80">Slant:</span>
      <input
        type="range"
        min={slantSettings.min}
        max={slantSettings.max}
        step={slantSettings.step}
        value={slantValue}
        onChange={(e) => setSlantValue(Number(e.target.value))}
        className="w-44 h-2 appearance-none bg-white/20 rounded-full slider-custom"
        aria-label="Slant axis"
      />
      <span className="text-sm text-white/60 w-8 text-right">{slantValue}</span>
    </div>
  );
}
