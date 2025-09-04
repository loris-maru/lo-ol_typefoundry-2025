import { cn } from "@/utils/classNames";

export default function Pagination({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  pageNumbers,
  goToPage,
}: {
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  pageNumbers: number[];
  goToPage: (page: number) => void;
}) {
  return (
    <div className="relativeflex flex h-1/5 w-full flex-row gap-x-4">
      {/* Previous Arrow */}
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-200",
          currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black",
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
              "flex h-8 w-8 items-center justify-center text-sm transition-colors duration-200",
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
          "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-200",
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-white hover:text-black",
        )}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );
}
