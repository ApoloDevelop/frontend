import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className="md:hidden ml-auto inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
      aria-label="Abrir menú de navegación"
      aria-controls="mobile-drawer"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
