import { RefObject } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

interface SearchInputProps {
  q: string;
  setQ: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
}

export function SearchInput({ q, setQ, inputRef, onClose }: SearchInputProps) {
  return (
    <motion.div
      key="input"
      className="flex items-center gap-2 rounded-md border bg-white px-2"
      initial={{ width: 40, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
    >
      <Search size={16} className="text-gray-500 shrink-0" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar en Apolo…"
        className="flex-1 bg-transparent outline-none text-sm py-2"
        aria-label="Buscar en Apolo"
      />
      <button
        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar buscador"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
