"use client";

import { useState } from "react";

interface ExpandableContentProps {
  content: string;
}

export function ExpandableContent({ content }: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Verificar si el texto es lo suficientemente largo para truncarlo
  const words = content.split(" ");
  const shouldTruncate = words.length > 15 || content.length > 150;

  return (
    <div className="mb-3 p-3 bg-muted/30 rounded-lg border-l-4 border-primary/20">
      <p
        className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
          !isExpanded && shouldTruncate ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:text-primary/80 mt-2 font-medium transition-colors cursor-pointer hover:underline"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}
