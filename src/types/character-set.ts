import { typeface } from "./typefaces";

export type CharacterSetProps = {
  value: string;
  unicode: string;
  lowercase?: string;
  variants?: string[];
};

export type AxisSettings = {
  wght: number;
  wdth?: number;
  slnt?: number;
  opsz?: number;
  italic?: boolean;
};

export type VariableSettingsProps = {
  content: typeface;
  axisSettings: AxisSettings;
  onAxisSettingsChange: (settings: AxisSettings) => void;
};
