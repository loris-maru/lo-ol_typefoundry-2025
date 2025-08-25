export type TextBlock = {
  id: number; // Unique identifier for the block
  text: string; // The editable text content
  fontSize: number; // Font size in pixels (12-48px)
  leading: number; // Line height multiplier (0.8-2.5)
  weight: number; // Font weight (100-900)
  width: number; // Font width variation (75-125)
  slant: number; // Font slant in degrees (-12° to 0°)
  columns: 1 | 2 | 3; // Column layout for the block
};
