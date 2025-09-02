import { useState, useEffect } from "react";

/**
 * Hook para simular la carga inicial de la página
 * @param delay - Tiempo de delay en milisegundos (default: 1000ms)
 * @returns boolean indicando si la página está cargando
 */
export function usePageLoading(delay = 1000): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
}
