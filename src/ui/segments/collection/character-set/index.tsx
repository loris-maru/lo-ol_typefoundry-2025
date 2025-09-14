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
  const [isInverted, setIsInverted] = useState<boolean>(false);

  const uprightFont = content.varFont;
  const italicFont = content.varFontItalic;

  // Load both fonts
  const uprightFontName = content.name;
  const italicFontName = `${content.name}Italic`;

  const { loaded: uprightLoaded } = useFont(uprightFontName, uprightFont);
  const { loaded: italicLoaded } = useFont(italicFontName, italicFont || "");

  // Determine which font to use (only use italic if it's available)
  const canUseItalic = italicFont && italicFont !== "";
  const currentFontName = axisSettings.italic && canUseItalic ? italicFontName : uprightFontName;

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
      try {
        if (!content.characterSetJSON) {
          console.warn("No characterSetJSON URL provided");
          return;
        }

        const response = await fetch(content.characterSetJSON);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch character set: ${response.status} ${response.statusText}`,
          );
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but got:", contentType, text.substring(0, 200));
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        setLatinCharacterSet(data);
      } catch (error) {
        console.error("Error fetching character set:", error);
        // Set empty character set as fallback
        setLatinCharacterSet([]);
      }
    }

    fetchCharSet();
  }, [content.characterSetJSON]);

  return (
    <section
      className={`relative grid h-full w-full grid-cols-2 gap-0 ${
        isInverted ? "bg-white" : "bg-black"
      }`}
    >
      <CharacterViewer
        activeCharacter={activeCharacter}
        characterSet={latinCharacterSet}
        setActiveCharacter={setActiveCharacter}
        content={content}
        axisSettings={axisSettings}
        onAxisSettingsChange={handleAxisSettingsChange}
        fontName={currentFontName}
        isInverted={isInverted}
        onToggleInverted={() => setIsInverted(!isInverted)}
      />
      <CharacterGrid
        characterSet={latinCharacterSet}
        hasHangul={content.hasHangul}
        script={script}
        setScript={setScript}
        activeCharacter={activeCharacter}
        setActiveCharacter={setActiveCharacter}
        fontName={currentFontName}
        isInverted={isInverted}
      />
    </section>
  );
}
