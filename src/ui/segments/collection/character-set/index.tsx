"use client";

import { useEffect, useState } from "react";

import { useFont } from "@react-hooks-library/core";

import { AxisSettings } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
import CharacterGrid from "@/ui/segments/collection/character-set/character-grid";
import CharacterViewer from "@/ui/segments/collection/character-set/character-viewer";

export default function CharacterSetPanel({ content }: { content: typeface }) {
  const [script, setScript] = useState<"latin" | "hangul">("latin");
  const [activeCharacter, setActiveCharacter] = useState<string>("A");
  // Axis settings state
  const [axisSettings, setAxisSettings] = useState({
    wght: 400,
    wdth: 100,
    slnt: 0,
    opsz: 14,
    italic: false,
  });

  const [latinCharacterSet, setLatinCharacterSet] = useState<CharacterSetProps[] | []>([]);

  const uprightFont = content.varFont;
  const italicFont = content.varFontItalic;

  // Load both fonts
  const uprightFontName = content.name;
  const italicFontName = `${content.name}Italic`;

  const { loaded: uprightLoaded, error: uprightError } = useFont(uprightFontName, uprightFont);
  const { loaded: italicLoaded, error: italicError } = useFont(italicFontName, italicFont || "");

  // Determine which font to use (only use italic if it's available)
  const canUseItalic = italicFont && italicFont !== "";
  const currentFontName = axisSettings.italic && canUseItalic ? italicFontName : uprightFontName;
  const currentFontFile = axisSettings.italic && canUseItalic ? italicFont : uprightFont;

  // Debug logging
  useEffect(() => {
    console.log("Current name: ", currentFontName);
  }, [
    axisSettings.italic,
    canUseItalic,
    currentFontName,
    currentFontFile,
    uprightLoaded,
    italicLoaded,
  ]);

  const handleAxisSettingsChange = (newSettings: AxisSettings) => {
    setAxisSettings({
      wght: newSettings.wght ?? 400,
      wdth: newSettings.wdth ?? 100,
      slnt: newSettings.slnt ?? 0,
      opsz: newSettings.opsz ?? 14,
      italic: newSettings.italic ?? false,
    });
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

  return (
    <section className="relative grid h-full w-full grid-cols-2 gap-0 bg-black">
      <CharacterViewer
        activeCharacter={activeCharacter}
        characterSet={latinCharacterSet}
        setActiveCharacter={setActiveCharacter}
        content={content}
        axisSettings={axisSettings}
        onAxisSettingsChange={handleAxisSettingsChange}
        fontName={currentFontName}
      />
      <CharacterGrid
        characterSet={latinCharacterSet}
        hasHangul={content.hasHangul}
        script={script}
        setScript={setScript}
        activeCharacter={activeCharacter}
        setActiveCharacter={setActiveCharacter}
        fontName={currentFontName}
      />
    </section>
  );
}
