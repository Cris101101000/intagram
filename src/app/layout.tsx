import type { Metadata } from "next";
import { AppProvider } from "@/shared/ui/providers/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auditoría de Instagram | BeweOS",
  description:
    "Descubre si tu Instagram está funcionando. Score de 0 a 100 comparado con negocios de tu sector.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-soft-aqua font-inter">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
