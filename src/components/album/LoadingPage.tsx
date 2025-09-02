import React from "react";

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({
  message = "Cargando álbum...",
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
