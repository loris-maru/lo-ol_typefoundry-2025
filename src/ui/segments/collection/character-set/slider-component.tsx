export default function SliderComponent({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="font-whisper flex flex-col gap-2 text-base">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
          onInput={(e) => {
            onChange(Number(e.currentTarget.value));
          }}
          className="h-2 flex-1 cursor-pointer"
        />
        <span className="text-xs text-gray-400">{max}</span>
        <span className="w-8 text-center text-xs text-white">{value}</span>
      </div>
    </div>
  );
}
