import { useMemo, useState } from "react";

import { CharacterSetProps } from "@/types/typefaces";
import { cn } from "@/utils/classNames";

export default function CharacterGrid({
  characterSet,
  hasHangul,
  fontName,
  script,
  setScript,
  activeCharacter,
  setActiveCharacter,
}: {
  characterSet: CharacterSetProps[];
  hasHangul: boolean;
  fontName: string;
  script: "latin" | "hangul";
  setScript: (script: "latin" | "hangul") => void;
  activeCharacter: string;
  setActiveCharacter: (character: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination settings
  const charactersPerPage = 64; // 8x8 grid = 64 characters per page

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
    <div className="relative h-full w-full py-8 pr-8 pl-4">
      {/* Character Grid */}
      <div className="divide relative grid h-3/5 w-full grid-cols-8 grid-rows-8 divide-white overflow-hidden rounded-2xl border border-solid border-neutral-700 text-white">
        {currentPageCharacters.map((character: CharacterSetProps, index) => (
          <button
            type="button"
            name={character.value}
            aria-label={character.value}
            onClick={() => setActiveCharacter(character.value)}
            key={`${character.value}-${character.unicode}-${index}`}
            className={cn(
              "relative flex h-full w-full items-center justify-center text-white",
              activeCharacter === character.value ? "bg-white text-black" : "bg-black text-white",
            )}
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' 900, 'wdth' ${900}, 'opsz' ${900}, 'slnt' ${0}`,
            }}
          >
            {character.value}
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="relative flex h-1/5 w-full items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-white text-white transition-colors duration-200",
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white hover:text-black",
            )}
            aria-label="Previous page"
          >
            ←
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => goToPage(pageNum)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors duration-200",
                  currentPage === pageNum ? "bg-white text-black" : "text-white hover:bg-gray-800",
                )}
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-white text-white transition-colors duration-200",
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white hover:text-black",
            )}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>

      {/* Script Switcher */}
      <div className="relative h-1/5 w-full">
        {hasHangul && (
          <div className="flex w-full flex-row items-start gap-x-2">
            <button
              type="button"
              name="script-switcher"
              aria-label="switch-to-latin"
              onClick={() => setScript("latin")}
              className={cn(
                "font-whisper relative flex h-full w-32 items-center justify-center rounded-4xl py-3 transition-colors duration-300 ease-in-out",
                script === "latin"
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-gray-800",
              )}
            >
              Latin
            </button>
            <button
              type="button"
              name="script-switcher-hangul"
              aria-label="switch-to-hangul"
              onClick={() => setScript("hangul")}
              className={cn(
                "font-whisper relative flex h-full w-32 items-center justify-center rounded-4xl py-3 transition-colors duration-300 ease-in-out hover:bg-gray-800",
                script === "hangul"
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-gray-800",
              )}
            >
              Hangul
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
