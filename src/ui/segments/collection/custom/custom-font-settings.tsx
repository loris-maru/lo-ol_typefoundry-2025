import SliderVariable from "@/ui/molecules/global/slider-variable";
import ToggleVariable from "@/ui/molecules/global/toggle-variable";

type SliderState = {
  value: number;
  setValue: (value: number) => void;
};

type CheckboxState = {
  value: boolean;
  setValue: (value: boolean) => void;
};

type SliderConfig = {
  label: string;
  min: number;
  max: number;
  step: number;
};

type CustomFontSettingsProps = {
  // fontSize: SliderState;
  lineHeight: SliderState;
  weight: SliderState;
  width: SliderState;
  slant: SliderState;
  opticalSize: SliderState;
  italic: CheckboxState;
  textColor: string;
  content: {
    has_wdth: boolean;
    has_slnt: boolean;
    has_opsz: boolean;
    has_italic: boolean;
  };
};

export default function CustomFontSettings({
  // fontSize,
  lineHeight,
  weight,
  width,
  slant,
  italic,
  opticalSize,
  textColor,
  content,
}: CustomFontSettingsProps) {
  const sliderConfigs: Record<string, SliderConfig> = {
    // fontSize: { label: "Font Size", min: 40, max: 220, step: 1 },
    lineHeight: { label: "Line Height", min: 0.8, max: 2.5, step: 0.1 },
    weight: { label: "Weight", min: 100, max: 900, step: 1 },
    width: { label: "Width", min: 100, max: 900, step: 1 },
    slant: { label: "Slant", min: 0, max: 90, step: 1 },
    opticalSize: { label: "Optical Size", min: 100, max: 900, step: 1 },
  };

  const sliderSettings = [
    // { key: "fontSize", state: fontSize, config: sliderConfigs.fontSize },
    { key: "lineHeight", state: lineHeight, config: sliderConfigs.lineHeight },
    { key: "weight", state: weight, config: sliderConfigs.weight },
    { key: "width", state: width, config: sliderConfigs.width, condition: content.has_wdth },
    { key: "slant", state: slant, config: sliderConfigs.slant, condition: content.has_slnt },
    {
      key: "opticalSize",
      state: opticalSize,
      config: sliderConfigs.opticalSize,
      condition: content.has_opsz,
    },
  ];

  return (
    <div className="relative flex w-full flex-row gap-x-6">
      {/* Number sliders */}
      {sliderSettings.map(({ key, state, config, condition }) => {
        if (condition === false) return null;

        return (
          <SliderVariable
            key={key}
            label={config.label}
            value={state.value}
            min={config.min}
            max={config.max}
            step={config.step}
            onChange={state.setValue}
            theme={textColor}
            className="w-1/4"
          />
        );
      })}

      {/* Boolean toggle */}
      {content.has_italic && (
        <ToggleVariable
          label="Italic"
          checked={italic.value}
          onChange={italic.setValue}
          theme={textColor}
          className="w-1/4"
        />
      )}
    </div>
  );
}
