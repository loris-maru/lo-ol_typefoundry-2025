import { cn } from "@/utils/classNames";

export default function ToggleVariable({
  label,
  checked,
  onChange,
  theme,
  className,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  theme: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "font-whisper cursor-pointer text-base font-medium transition-colors duration-300 ease-linear",
        className,
      )}
      style={{ color: theme }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="block" style={{ color: theme }}>
          {label}
        </span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onChange(!checked)}
            className="relative inline-flex h-8 w-16 items-center rounded-full border border-solid border-black transition-colors duration-200 outline-none focus:outline-none"
            aria-pressed={checked}
            aria-label={`Toggle ${label}`}
          >
            <span
              className={cn(
                "inline-block h-6 w-6 transform rounded-full bg-black transition-transform duration-200",
                checked ? "translate-x-[34px]" : "translate-x-1",
              )}
            />
          </button>
        </div>
      </div>
    </label>
  );
}
