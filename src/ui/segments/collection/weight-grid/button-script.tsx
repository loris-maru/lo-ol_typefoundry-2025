import { cn } from "@/utils/classNames";

export default function ButtonScript({
  activeScript,
  setActiveScript,
}: {
  activeScript: "latin" | "hangul";
  setActiveScript: (script: "latin" | "hangul") => void;
}) {
  return (
    <div className="relative flex flex-row items-center gap-x-2">
      <button
        type="button"
        aria-label="switch-to-latin"
        name="switch-to-latin"
        onClick={() => setActiveScript("latin")}
        className={cn(
          "relative font-kronik px-6 py-2 rounded-full cursor-pointer",
          activeScript == "latin"
            ? "bg-white text-black"
            : "bg-black text-white border border-solid border-black",
        )}
      >
        <span className="relative top-px">Latin</span>
      </button>
      <button
        type="button"
        aria-label="switch-to-hangul"
        name="switch-to-hangul"
        onClick={() => setActiveScript("hangul")}
        className={cn(
          "relative font-kronik px-6 py-2 rounded-full cursor-pointer",
          activeScript == "hangul"
            ? "bg-white text-black"
            : "bg-black text-white border border-solid border-black",
        )}
      >
        <span className="relative top-px">Hangul</span>
      </button>
    </div>
  );
}
