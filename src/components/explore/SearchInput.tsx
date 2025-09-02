import { Input } from "@/components/ui/input";
import { Kind } from "@/hooks/explore/useSearch";
import { X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  type: Kind;
  placeholder?: string;
}

const placeholders: Record<Kind, string> = {
  artist: "Buscar artistas",
  album: "Buscar álbumes",
  track: "Buscar canciones",
};

export default function SearchInput({
  value,
  onChange,
  type,
  placeholder,
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || placeholders[type]}
        className="w-full pr-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
