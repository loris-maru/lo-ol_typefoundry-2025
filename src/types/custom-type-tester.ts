import { typeface } from "@/types/typefaces";

export type TextSettings = {
  color: string;
  align: string;
  setColor: (color: string) => void;
  setAlign: (align: "left" | "center" | "right") => void;
};

export type BackgroundSettings = {
  type: string;
  color: string;
  image: string;
  setType: (type: "color" | "image") => void;
  setColor: (color: string) => void;
  setImage: (image: string) => void;
};

export type FontSettings = {
  lineHeight: { value: number; setValue: (height: number) => void };
  weight: { value: number; setValue: (weight: number) => void };
  width: { value: number; setValue: (width: number) => void };
  slant: { value: number; setValue: (slant: number) => void };
  italic: { value: boolean; setValue: (italic: boolean) => void };
  opticalSize: { value: number; setValue: (size: number) => void };
};

export type GlobalSettingsProps = {
  content: typeface;
  text: TextSettings;
  background: BackgroundSettings;
  font: FontSettings;
};
