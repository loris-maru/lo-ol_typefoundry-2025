export default function OpticalSizeSlider({
  opticalSizeValue,
  setOpticalSizeValue,
  opticalSizeSettings,
}: {
  opticalSizeValue: number;
  setOpticalSizeValue: (value: number) => void;
  opticalSizeSettings: {
    min: number;
    max: number;
    step: number;
    value: number;
  };
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="font-whisper text-base text-white">Optical Size:</span>
      <input
        type="range"
        min={opticalSizeSettings.min}
        max={opticalSizeSettings.max}
        step={opticalSizeSettings.step}
        value={opticalSizeValue}
        onChange={(e) => setOpticalSizeValue(Number(e.target.value))}
        className="slider-custom h-2 w-44 appearance-none rounded-full bg-white/20"
        aria-label="Width axis"
      />
      <span className="w-8 text-right text-sm text-white/60">{opticalSizeValue}</span>
    </div>
  );
}
