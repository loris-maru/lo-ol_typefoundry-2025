"use client";

import { useEffect, useState } from "react";

import { CharacterSetProps, typeface } from "@/types/typefaces";
import CharacterGrid from "@/ui/segments/collection/character-set/character-grid";
import CharacterViewer from "@/ui/segments/collection/character-set/character-viewer";

export default function CharacterSetPanel({ content }: { content: typeface }) {
  const [script, setScript] = useState<"latin" | "hangul">("latin");
  const [activeCharacter, setActiveCharacter] = useState<string>("A");

  const [latinCharacterSet, setLatinCharacterSet] = useState<CharacterSetProps[] | []>([]);

  // Axis settings state
  const [axisSettings, setAxisSettings] = useState({
    wght: 400,
    wdth: 100,
    slnt: 0,
    opsz: 14,
    italic: false,
  });

  const handleAxisSettingsChange = (newSettings: typeof axisSettings) => {
    console.log("Axis settings changed:", newSettings);
    setAxisSettings(newSettings);
  };

  // ---------------
  // LATIN
  // ---------------

  useEffect(() => {
    async function fetchCharSet() {
      const response = await fetch(content.characterSetJSON);
      const data = await response.json();
      setLatinCharacterSet(data);
    }

    fetchCharSet().catch(console.error);
  }, [content.characterSetJSON]);

  console.log("Latin character set:", content.characterSetJSON);

  return (
    <section className="relative grid h-full w-full grid-cols-2 gap-0 bg-black">
      <CharacterViewer
        activeCharacter={activeCharacter}
        uprightFontFile={content.uprightTTFVar}
        italicFontFile={content.varFontItalic}
        characterSet={latinCharacterSet}
        setActiveCharacter={setActiveCharacter}
        content={content}
        axisSettings={axisSettings}
        onAxisSettingsChange={handleAxisSettingsChange}
      />
      <CharacterGrid
        characterSet={latinCharacterSet}
        hasHangul={content.hasHangul}
        fontName={content.name}
        script={script}
        setScript={setScript}
        activeCharacter={activeCharacter}
        setActiveCharacter={setActiveCharacter}
      />
    </section>
  );
}
