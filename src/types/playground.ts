export type TypefaceSettings = {
  wght: number;
  setWght: (value: number) => void;
  has_wdth: boolean;
  wdth: number;
  setWdth: (value: number) => void;
  has_slnt: boolean;
  slnt: number;
  setSlnt: (value: number) => void;
  has_opsz: boolean;
  opsz: number;
  setOpsz: (value: number) => void;
  has_italic: boolean;
  italic: boolean;
  setItalic: (value: boolean) => void;
  lh: number;
  setLh: (value: number) => void;
  textAlign?: "left" | "center" | "right";
  setTextAlign?: (value: "left" | "center" | "right") => void;
};

export type TextStylingSettings = {
  textColor?: string;
  setTextColor?: (color: string) => void;
};

export type BackgroundSettings = {
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
  backgroundType?: "transparent" | "color" | "image";
  setBackgroundType?: (type: "transparent" | "color" | "image") => void;
  backgroundImage?: string | null;
  setBackgroundImage?: (image: string | null) => void;
};

export type PaddingSettings = {
  paddingTop?: number;
  setPaddingTop?: (value: number) => void;
  paddingRight?: number;
  setPaddingRight?: (value: number) => void;
  paddingBottom?: number;
  setPaddingBottom?: (value: number) => void;
  paddingLeft?: number;
  setPaddingLeft?: (value: number) => void;
};

export type SettingMenuProps = {
  settings: TypefaceSettings;
  onClose?: () => void;
  textStyling?: TextStylingSettings;
  background?: BackgroundSettings;
  padding?: PaddingSettings;
};
