import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <motion.button
      key="icon"
      aria-label="Buscar"
      className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
    >
      <Search size={18} />
    </motion.button>
  );
}
