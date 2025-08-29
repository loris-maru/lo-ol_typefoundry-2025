export type WeightDef = {
  name: string;
  hangul: string;
  value: number;
  abbr: string;
};

export const WEIGHTS: WeightDef[] = [
  { name: "Thin", hangul: "띤", value: 100, abbr: "Th" },
  { name: "ExtraLight", hangul: "엑스트라 라이트", value: 200, abbr: "EL" },
  { name: "Light", hangul: "라이트", value: 300, abbr: "Li" },
  { name: "Regular", hangul: "레귤러", value: 400, abbr: "Re" },
  { name: "Medium", hangul: "미디움", value: 500, abbr: "Me" },
  { name: "Semibold", hangul: "세미볼드", value: 600, abbr: "Se" },
  { name: "Bold", hangul: "볼드", value: 700, abbr: "Bo" },
  { name: "ExtraBold", hangul: "엑스트라볼드", value: 800, abbr: "EB" },
  { name: "Black", hangul: "블랙", value: 900, abbr: "Bl" },
];
