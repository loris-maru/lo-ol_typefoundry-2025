import { cn } from "@/utils/classNames";

export default function CheckboxVariable({
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
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-2 border-current"
            style={{
              accentColor: theme,
              backgroundColor: checked ? theme : "transparent",
            }}
          />
        </div>
      </div>
    </label>
  );
}
