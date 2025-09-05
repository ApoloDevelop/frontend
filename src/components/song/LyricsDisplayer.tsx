"use client";

import { useRef, useState } from "react";

interface LyricsDisplayerProps {
  lyrics: string | null;
}

export const LyricsDisplayer: React.FC<LyricsDisplayerProps> = ({ lyrics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleLyrics = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="rounded-xl border p-4 bg-white cursor-pointer"
      onClick={toggleLyrics}
    >
      <div
        className="overflow-hidden transition-[max-height] duration-700 ease-in-out"
        style={{
          maxHeight: isExpanded
            ? `${contentRef.current?.scrollHeight}px`
            : "0px",
        }}
      >
        <div
          ref={contentRef}
          className="leading-relaxed text-gray-800 whitespace-pre-wrap"
        >
          {lyrics || "No hay letra disponible."}
        </div>
      </div>
      {!isExpanded && (
        <div className="text-gray-500 text-center">
          Pulsa para mostrar la letra
        </div>
      )}
    </div>
  );
};
