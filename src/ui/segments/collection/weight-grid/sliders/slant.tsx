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
      <span className="font-whisper text-base text-white">Slant:</span>
      <input
        type="range"
        min={slantSettings.min}
        max={slantSettings.max}
        step={slantSettings.step}
        value={slantValue}
        onChange={(e) => setSlantValue(Number(e.target.value))}
        className="slider-custom h-2 w-44 appearance-none"
        aria-label="Slant axis"
      />
      <span className="w-8 text-right text-sm text-white/60">{slantValue}</span>
    </div>
  );
}
