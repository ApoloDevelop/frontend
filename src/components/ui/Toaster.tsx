"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

export default function Toaster({
  position = "top-center",
  closeButton = true,
  richColors = true,
  ...props
}: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      closeButton={closeButton}
      richColors={richColors}
      className="toaster group"
      toastOptions={{
        duration: 3000, // ajusta si quieres más/menos tiempo
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
