// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Apolo",
  description: "La gran app musical",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl">Apolo</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
