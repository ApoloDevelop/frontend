"use client";

import { Suspense } from "react";
import { NewsSearchContent } from "./NewsSearchContent";

export function NewsSearch({ placeholder = "Buscar por título o tag…" }) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
        </div>
      }
    >
      <NewsSearchContent placeholder={placeholder} />
    </Suspense>
  );
}
