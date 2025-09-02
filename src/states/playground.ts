import { create } from 'zustand';

export interface TextBlock {
  id: number;
  text: string;
  fontSize: number;
  leading: number;
  weight: number;
  width: number;
  slant: number;
  columns: 1 | 2 | 3;
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
      text: 'Our goal is to connect both typographic cultures and share our knowledge of calligraphy, sketching, exploration and type design.',
      fontSize: 80,
      leading: 1.5,
      weight: 400,
      width: 100,
      slant: 0,
      columns: 1,
    },
    {
      id: 2,
      text: "Typefaces and the technologies used to bring them to life on screen are already incredibly advanced and have been mastered by many designers, but we've made the decision to inject strong personalities, into our type projects. However, we are trying to step away, as far as possible, from projects in which the designer's personality enters into the work.",
      fontSize: 42,
      leading: 1.4,
      weight: 600,
      width: 110,
      slant: -2,
      columns: 2,
    },
    {
      id: 3,
      text: 'We hope that our website gives you a glimpse of a future where type design fully embraces digital. Of course, this is just the beginning, and we are just two explorers finding our way in a new world of type, deeply passionate about creating a new type family. We believe that our website demonstrates the passion we have for our work, through typefaces, work in progress, and experimentation.',
      fontSize: 42,
      leading: 1.4,
      weight: 600,
      width: 110,
      slant: -2,
      columns: 2,
    },
    {
      id: 4,
      text: 'The Eiger village of Grindelwald in the Bernese Oberland lies embedded in a welcoming and green hollow, surrounded by a commanding mountainscape with the Eiger north face and the Wetterhorn. This mountainscape and the numerous lookout points and activities make Grindelwald one of the most popular and cosmopolitan holiday and excursion destinations in Switzerland, and the largest ski resort in the Jungfrau region.',
      fontSize: 18,
      leading: 1.6,
      weight: 300,
      width: 90,
      slant: 0,
      columns: 3,
    },
    {
      id: 5,
      text: 'The Eiger village of Grindelwald in the Bernese Oberland lies embedded in a welcoming and green hollow, surrounded by a commanding mountainscape with the Eiger north face and the Wetterhorn. This mountainscape and the numerous lookout points and activities make Grindelwald one of the most popular and cosmopolitan holiday and excursion destinations in Switzerland, and the largest ski resort in the Jungfrau region.',
      fontSize: 18,
      leading: 1.6,
      weight: 300,
      width: 90,
      slant: 0,
      columns: 3,
    },
    {
      id: 6,
      text: 'The Eiger village of Grindelwald in the Bernese Oberland lies embedded in a welcoming and green hollow, surrounded by a commanding mountainscape with the Eiger north face and the Wetterhorn. This mountainscape and the numerous lookout points and activities make Grindelwald one of the most popular and cosmopolitan holiday and excursion destinations in Switzerland, and the largest ski resort in the Jungfrau region.',
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
      text: 'New text block - edit this content',
      fontSize: 16,
      leading: 1.5,
      weight: 400,
      width: 100,
      slant: 0,
      columns,
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
