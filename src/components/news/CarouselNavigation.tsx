import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselNavigationProps {
  itemsLength: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export function CarouselNavigation({
  itemsLength,
  currentIndex,
  onPrev,
  onNext,
}: CarouselNavigationProps) {
  if (itemsLength <= 1) return null;

  return (
    <div className="mb-6 flex items-center justify-between px-2 sm:px-0">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Anterior"
          className="rounded-full border border-purple-200 bg-white hover:bg-purple-50 px-3 py-2 transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm hover:shadow-md dark:border-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/20"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5 text-black dark:text-purple-300" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Siguiente"
          className="rounded-full border border-purple-200 bg-white hover:bg-purple-50 px-3 py-2 transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm hover:shadow-md dark:border-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/20"
          disabled={currentIndex === itemsLength - 1}
        >
          <ChevronRight className="h-5 w-5 text-black dark:text-purple-300" />
        </button>
      </div>
    </div>
  );
}
