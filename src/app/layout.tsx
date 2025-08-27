import { Scroll } from "lucide-react";
import "./globals.css";
import Header from "@/components/header/Header";
import ScrollTopOnRouteChange from "@/components/system/ScrollTopOnRouteChange";
import Toaster from "@/components/ui/Toaster";

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
        <Toaster />
      </body>
    </html>
  );
}
