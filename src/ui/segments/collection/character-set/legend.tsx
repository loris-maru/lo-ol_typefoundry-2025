import { cn } from "@/utils/classNames";

export default function Legend({ isInverted = false }: { isInverted: boolean }) {
  return (
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={cn("h-3 w-3 rounded-full", isInverted ? "bg-red-500" : "bg-red-400")} />
        <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Baseline</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("h-3 w-3 rounded-full", isInverted ? "bg-blue-500" : "bg-blue-400")} />
        <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Ascender</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("h-3 w-3 rounded-full", isInverted ? "bg-green-500" : "bg-green-400")} />
        <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Cap Height</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn("h-3 w-3 rounded-full", isInverted ? "bg-yellow-500" : "bg-yellow-400")}
        />
        <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>X-Height</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn("h-3 w-3 rounded-full", isInverted ? "bg-purple-500" : "bg-purple-400")}
        />
        <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Descender</span>
      </div>
    </div>
  );
}
