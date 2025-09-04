"use client";

import { VariableSettingsProps } from "@/types/character-set";

export default function VariableSettings({
  content,
  axisSettings,
  onAxisSettingsChange,
}: VariableSettingsProps) {
  const updateSetting = (key: string, value: number | boolean) => {
    console.log(`Updating ${key} to ${value}`);
    console.log("Current axisSettings:", axisSettings);
    const newSettings = { ...axisSettings, [key]: value };
    console.log("New settings:", newSettings);
    onAxisSettingsChange(newSettings);
  };

  const SliderComponent = ({
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
  }) => (
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
            console.log(`Slider ${label} changed to:`, e.target.value);
            onChange(Number(e.target.value));
          }}
          className="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600"
          style={{
            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((value - min) / (max - min)) * 100}%, #4b5563 ${((value - min) / (max - min)) * 100}%, #4b5563 100%)`,
          }}
        />
        <span className="text-xs text-gray-400">{max}</span>
        <span className="w-8 text-center text-xs text-white">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col gap-4 rounded-lg text-white">
      <div className="relative flex flex-col gap-5">
        {/* Weight Slider - Always available */}
        <SliderComponent
          label="Weight"
          value={axisSettings.wght}
          min={100}
          max={900}
          step={1}
          onChange={(value) => updateSetting("wght", value)}
        />

        {/* Width Slider - Only if font has width variation */}
        {content.has_wdth && (
          <SliderComponent
            label="Width"
            value={axisSettings.wdth ?? 100}
            min={100}
            max={900}
            step={1}
            onChange={(value) => updateSetting("wdth", value)}
          />
        )}

        {/* Slant Slider - Only if font has slant variation */}
        {content.has_slnt && (
          <SliderComponent
            label="Slant"
            value={axisSettings.slnt ?? 0}
            min={0}
            max={90}
            step={1}
            onChange={(value) => updateSetting("slnt", value)}
          />
        )}

        {/* Optical Size Slider - Only if font has optical size variation */}
        {content.has_opsz && (
          <SliderComponent
            label="Optical Size"
            value={axisSettings.opsz ?? 100}
            min={100}
            max={900}
            step={1}
            onChange={(value) => updateSetting("opsz", value)}
          />
        )}

        {/* Italic Toggle - Only if font has italic variation */}
        {content.has_italic && (
          <div className="flex items-center gap-3">
            <label className="font-whisper text-base font-medium text-white">Italic</label>
            <button
              type="button"
              onClick={() => updateSetting("italic", !axisSettings.italic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                axisSettings.italic ? "bg-white" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  axisSettings.italic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
