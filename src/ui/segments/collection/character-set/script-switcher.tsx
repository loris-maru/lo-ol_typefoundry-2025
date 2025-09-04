import { cn } from "@/utils/classNames";

export default function ScriptSwitcher({
  hasHangul,
  script,
  setScript,
}: {
  hasHangul: boolean;
  script: "latin" | "hangul";
  setScript: (script: "latin" | "hangul") => void;
}) {
  return (
    <div className="relative h-1/5 w-full">
      {hasHangul && (
        <div className="flex w-full flex-row items-start gap-x-2">
          <button
            type="button"
            name="script-switcher"
            aria-label="switch-to-latin"
            onClick={() => setScript("latin")}
            className={cn(
              "font-whisper relative flex h-full w-32 items-center justify-center rounded-4xl py-3 transition-colors duration-300 ease-in-out",
              script === "latin" ? "bg-white text-black" : "bg-black text-white hover:bg-gray-800",
            )}
          >
            Latin
          </button>
          <button
            type="button"
            name="script-switcher-hangul"
            aria-label="switch-to-hangul"
            onClick={() => setScript("hangul")}
            className={cn(
              "font-whisper relative flex h-full w-32 items-center justify-center rounded-4xl py-3 transition-colors duration-300 ease-in-out hover:bg-gray-800",
              script === "hangul" ? "bg-white text-black" : "bg-black text-white hover:bg-gray-800",
            )}
          >
            Hangul
          </button>
        </div>
      )}
    </div>
  );
}
