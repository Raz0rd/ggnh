import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import UtmCapture from "@/components/UtmCapture";

export const metadata: Metadata = {
  title: "CNH Social 2026 - Carteira Nacional de Habilitação Gratuita",
  description: "Faça hoje mesmo a sua inscrição para a CNH Social 2026 de forma gratuita.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17859172217"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17859172217');
          `}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <UtmCapture />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
