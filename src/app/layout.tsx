import { Scroll } from "lucide-react";
import "./globals.css";
import Header from "@/components/ui/Header";
import ScrollTopOnRouteChange from "@/components/system/ScrollTopOnRouteChange";

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
        <ScrollTopOnRouteChange behavior="instant" />
        <main>{children}</main>
      </body>
    </html>
  );
}
