import type { Metadata } from "next";
import Image from "next/image";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-soft-aqua font-inter">
        {/* Bewe logo — top left on all pages */}
        <div style={{ position: 'fixed', top: 16, left: 20, zIndex: 9000, pointerEvents: 'none' }}>
          <Image
            src="/bewe-logo.png"
            alt="Bewe"
            width={80}
            height={22}
            style={{ height: 22, width: 'auto', opacity: 0.85 }}
            priority
          />
        </div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
