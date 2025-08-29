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
      <span className="text-base text-white font-whisper">Optical Size:</span>
      <input
        type="range"
        min={opticalSizeSettings.min}
        max={opticalSizeSettings.max}
        step={opticalSizeSettings.step}
        value={opticalSizeValue}
        onChange={(e) => setOpticalSizeValue(Number(e.target.value))}
        className="w-44 h-2 appearance-none bg-white/20 rounded-full slider-custom"
        aria-label="Width axis"
      />
      <span className="text-sm text-white/60 w-8 text-right">
        {opticalSizeValue}
      </span>
    </div>
  );
}
