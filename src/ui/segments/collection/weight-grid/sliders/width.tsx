export default function WidthSlider({
  widthValue,
  setWidthValue,
  widthSettings,
}: {
  widthValue: number;
  setWidthValue: (value: number) => void;
  widthSettings: {
    min: number;
    max: number;
    step: number;
    value: number;
  };
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="font-whisper text-base text-white">Width:</span>
      <input
        type="range"
        min={widthSettings.min}
        max={widthSettings.max}
        step={widthSettings.step}
        value={widthValue}
        onChange={(e) => setWidthValue(Number(e.target.value))}
        className="slider-custom h-2 w-44 appearance-none"
        aria-label="Width axis"
      />
      <span className="w-8 text-right text-sm text-white/60">{widthValue}</span>
    </div>
  );
}
