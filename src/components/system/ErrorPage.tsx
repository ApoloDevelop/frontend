import React from "react";

interface ErrorPageProps {
  message?: string;
  title?: string;
  icon?: string;
}

export function ErrorPage({
  message = "Ha ocurrido un error",
  title = "Oops!",
  icon = "⚠️",
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">{icon}</div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
