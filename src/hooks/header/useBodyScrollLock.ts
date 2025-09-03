import { useEffect } from "react";

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isLocked]);
}
