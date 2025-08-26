export type WeightDef = { name: string; value: number; abbr: string };

export const WEIGHTS: WeightDef[] = [
  { name: "Thin", value: 100, abbr: "Th" },
  { name: "ExtraLight", value: 200, abbr: "EL" },
  { name: "Light", value: 300, abbr: "Li" },
  { name: "Regular", value: 400, abbr: "Re" },
  { name: "Medium", value: 500, abbr: "Me" },
  { name: "Semibold", value: 600, abbr: "Se" },
  { name: "Bold", value: 700, abbr: "Bo" },
  { name: "ExtraBold", value: 800, abbr: "EB" },
  { name: "Black", value: 900, abbr: "Bl" },
];
