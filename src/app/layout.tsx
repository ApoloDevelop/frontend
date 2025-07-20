import "./globals.css";
import Header from "@/components/ui/Header";

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
    <html lang="es" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
