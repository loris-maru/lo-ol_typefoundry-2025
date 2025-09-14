export type LicenseType = "web" | "print" | "webAndPrint";

export type OrderedFont = {
  fontID: string;
  fontFamilyID: string;
  license: LicenseType;
  weight: number; // wght
  width: number | null; // wdth
  slant: number | null; // slnt
  opticalSize: number | null; // opsz
  isItalic: boolean;
  specimen: string; // R2 key for the PDF (e.g. "specimens/Fuzar.pdf")
  eula: string; // R2 key for the PDF (e.g. "eulas/LO-OL-EULA.pdf")
};
