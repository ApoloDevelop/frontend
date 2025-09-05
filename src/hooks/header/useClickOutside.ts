import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  triggerRef?: React.RefObject<HTMLElement | null>
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        isOpen &&
        elementRef.current &&
        !elementRef.current.contains(target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen, onClose, triggerRef]);

  return elementRef;
}
