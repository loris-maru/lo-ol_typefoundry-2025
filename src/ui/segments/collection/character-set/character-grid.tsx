import { useMemo, useState } from "react";

import { CharacterSetProps } from "@/types/typefaces";
import Pagination from "@/ui/segments/collection/character-set/pagination";
import { cn } from "@/utils/classNames";

import ScriptSwitcher from "./script-switcher";

export default function CharacterGrid({
  characterSet,
  hasHangul,
  fontName,
  script,
  setScript,
  activeCharacter,
  setActiveCharacter,
  isInverted = false,
}: {
  characterSet: CharacterSetProps[];
  hasHangul: boolean;
  fontName: string;
  script: "latin" | "hangul";
  setScript: (script: "latin" | "hangul") => void;
  activeCharacter: string;
  setActiveCharacter: (character: string) => void;
  isInverted?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination settings
  const charactersPerPage = 80; // 8x10 grid = 80 characters per page

  // Calculate pagination
  const totalPages = Math.ceil(characterSet.length / charactersPerPage);
  const startIndex = (currentPage - 1) * charactersPerPage;
  const endIndex = startIndex + charactersPerPage;
  const currentPageCharacters = characterSet.slice(startIndex, endIndex);

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl p-8 ${
        isInverted ? "bg-white" : "bg-transparent"
      }`}
    >
      {/* Character Grid */}
      <div
        className={`relative grid w-full grid-cols-8 grid-rows-10 ${
          isInverted ? "text-black" : "text-white"
        }`}
        id="character-grid"
      >
        {currentPageCharacters.map((character: CharacterSetProps, index) => (
          <button
            type="button"
            name={character.value}
            aria-label={character.value}
            onClick={() => setActiveCharacter(character.value)}
            key={`${character.value}-${character.unicode}-${index}`}
            className={cn(
              "relative flex aspect-square w-full items-center justify-center border text-xl",
              isInverted
                ? activeCharacter === character.value
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-white text-black"
                : activeCharacter === character.value
                  ? "border-neutral-700 bg-white text-black"
                  : "border-neutral-700 bg-black text-white",
            )}
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' ${900}, 'wdth' ${900}, 'opsz' ${900}, 'slnt' ${0}`,
            }}
          >
            {character.value}
          </button>
        ))}
      </div>
      <div className="relative mt-10 flex w-full flex-row justify-between">
        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          pageNumbers={pageNumbers}
          goToPage={goToPage}
        />

        {/* Script Switcher */}
        <ScriptSwitcher hasHangul={hasHangul} script={script} setScript={setScript} />
      </div>
    </div>
  );
}
