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
      <span className="text-base text-white font-whisper">Width:</span>
      <input
        type="range"
        min={widthSettings.min}
        max={widthSettings.max}
        step={widthSettings.step}
        value={widthValue}
        onChange={(e) => setWidthValue(Number(e.target.value))}
        className="w-44 h-2 appearance-none bg-white/20 rounded-full slider-custom"
        aria-label="Width axis"
      />
      <span className="text-sm text-white/60 w-8 text-right">{widthValue}</span>
    </div>
  );
}
