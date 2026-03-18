import type { Metadata } from "next";
import Image from "next/image";
import { AppProvider } from "@/shared/ui/providers/AppProvider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://igaudit.bewe.io"),
  title: "Auditoría de Instagram Gratis | BeweOS",
  description:
    "Descubre si tu Instagram está funcionando. Score de 0 a 100 comparado con negocios de tu sector. Análisis gratuito en segundos.",
  keywords: ["auditoría instagram", "instagram para negocios", "score instagram", "análisis instagram gratis", "instagram pymes"],
  authors: [{ name: "Bewe", url: "https://www.bewe.io" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "IG Audit by Bewe",
    title: "Auditoría de Instagram Gratis | BeweOS",
    description: "Descubre si tu Instagram está funcionando. Score de 0 a 100 comparado con negocios de tu sector.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Auditoría de Instagram — IG Audit by Bewe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auditoría de Instagram Gratis | BeweOS",
    description: "Descubre si tu Instagram está funcionando. Score de 0 a 100 comparado con negocios de tu sector.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
