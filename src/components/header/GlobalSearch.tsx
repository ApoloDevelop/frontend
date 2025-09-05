"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGlobalSearch } from "@/hooks/header/useGlobalSearch";
import { useSearchFilters } from "@/hooks/header/useSearchFilters";
import {
  SearchButton,
  SearchInput,
  SearchFilters,
  SearchResults,
} from "./search";

export function GlobalSearch() {
  const { open, q, setQ, loading, results, inputRef, openSearch, closeSearch } =
    useGlobalSearch();

  const { filters, toggleFilter, toggleAllFilters, hasActiveFilters } =
    useSearchFilters();

  const hasAny = hasActiveFilters(results);

  return (
    <div className="relative" data-global-search>
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <SearchButton onClick={openSearch} />
        ) : (
          <SearchInput
            q={q}
            setQ={setQ}
            inputRef={inputRef}
            onClose={closeSearch}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (loading || hasAny || q.trim().length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[min(92vw,560px)] z-[60] rounded-xl border bg-white shadow-xl"
          >
            <div className="p-2 divide-y max-h-[80vh] overflow-y-auto">
              {/* Filtros */}
              {!loading && q.trim().length >= 2 && (
                <SearchFilters
                  filters={filters}
                  results={results}
                  onToggleFilter={toggleFilter}
                  onToggleAllFilters={toggleAllFilters}
                />
              )}

              {/* Resultados */}
              <SearchResults
                results={results}
                filters={filters}
                loading={loading}
                query={q}
                hasActiveFilters={hasAny}
                onItemClick={closeSearch}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
