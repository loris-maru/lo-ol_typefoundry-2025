import { create } from "zustand";

import defaultTexts from "@/ui/segments/collection/playground/CONTENT";

export interface TextBlock {
  id: number;
  text: string;
  fontSize: number;
  leading: number;
  weight: number;
  width: number;
  slant: number;
  columns: 1 | 2 | 3;
  textAlign?: "left" | "center" | "right";
}

interface PlaygroundState {
  activeBlocks: TextBlock[];
  addBlock: (columns: 1 | 2 | 3) => void;
  deleteBlock: (id: number) => void;
  updateBlock: (id: number, field: string, value: string | number) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  activeBlocks: [
    {
      id: 1,
      text: defaultTexts.one[0],
      fontSize: 80,
      leading: 1.5,
      weight: 400,
      width: 100,
      slant: 0,
      columns: 1,
    },
    {
      id: 2,
      text: defaultTexts.two[0],
      fontSize: 42,
      leading: 1.4,
      weight: 600,
      width: 110,
      slant: -2,
      columns: 2,
    },
    {
      id: 3,
      text: defaultTexts.two[1],
      fontSize: 42,
      leading: 1.4,
      weight: 600,
      width: 110,
      slant: -2,
      columns: 2,
    },
    {
      id: 4,
      text: defaultTexts.three[0],
      fontSize: 18,
      leading: 1.6,
      weight: 300,
      width: 90,
      slant: 0,
      columns: 3,
    },
    {
      id: 5,
      text: defaultTexts.three[1],
      fontSize: 18,
      leading: 1.6,
      weight: 300,
      width: 90,
      slant: 0,
      columns: 3,
    },
    {
      id: 6,
      text: defaultTexts.three[2],
      fontSize: 18,
      leading: 1.6,
      weight: 300,
      width: 90,
      slant: 0,
      columns: 3,
    },
  ],

  addBlock: (columns: 1 | 2 | 3) => {
    const { activeBlocks } = get();
    const newId = Math.max(...activeBlocks.map((block) => block.id), 0) + 1;

    const newBlock: TextBlock = {
      id: newId,
      text: "New text block - edit this content",
      fontSize: 16,
      leading: 1.5,
      weight: 400,
      width: 100,
      slant: 0,
      columns,
      textAlign: "left",
    };

    set({ activeBlocks: [...activeBlocks, newBlock] });
  },

  deleteBlock: (id: number) => {
    const { activeBlocks } = get();
    set({ activeBlocks: activeBlocks.filter((block) => block.id !== id) });
  },

  updateBlock: (id: number, field: string, value: string | number) => {
    const { activeBlocks } = get();
    set({
      activeBlocks: activeBlocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block,
      ),
    });
  },
}));
