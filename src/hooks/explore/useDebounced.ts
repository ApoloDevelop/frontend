import { useState, useEffect } from "react";

/**
 * Hook para debouncing de valores
 * @param value - Valor a debouncar
 * @param delay - Retraso en milisegundos (default: 400ms)
 * @returns Valor debouncado
 */
export function useDebounced<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
