import { cn } from "@/utils/classNames";

export default function SliderVariable({
  label,
  value,
  min,
  max,
  step,
  onChange,
  theme,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  theme: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "font-whisper text-base font-medium transition-colors duration-300 ease-linear",
        className,
      )}
      style={{ color: theme }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="block" style={{ color: theme }}>
          {label}
        </span>
        <span className="text-sm font-medium" style={{ color: theme }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        name={label}
        aria-label={label}
        className="slider-variable h-2 w-full appearance-none outline-none"
        style={
          {
            "--slider-theme": theme,
            background: theme,
          } as React.CSSProperties
        }
      />
    </label>
  );
}
