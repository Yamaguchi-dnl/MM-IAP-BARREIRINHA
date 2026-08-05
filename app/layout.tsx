import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { eventoConfig } from "@/config/evento";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fonteDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fonteCorpo = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: eventoConfig.nomeEvento,
    template: `%s · ${eventoConfig.nomeEvento}`,
  },
  description: eventoConfig.descricaoCurta,
  openGraph: {
    title: eventoConfig.nomeEvento,
    description: eventoConfig.descricaoCurta,
    url: siteUrl,
    siteName: eventoConfig.nomeEvento,
    images: [{ url: eventoConfig.imagemSocial }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: eventoConfig.nomeEvento,
    description: eventoConfig.descricaoCurta,
    images: [eventoConfig.imagemSocial],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fonteDisplay.variable} ${fonteCorpo.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
