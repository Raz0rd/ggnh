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
            
            // Função de conversão do Google Ads (chamada quando pagamento confirmado)
            window.gtag_report_conversion = function(transactionId, value) {
              // Verificar se já foi enviada essa conversão
              var sentKey = 'conversion_sent_' + transactionId;
              if (localStorage.getItem(sentKey)) {
                console.log('Conversão já enviada para:', transactionId);
                return false;
              }
              
              gtag('event', 'conversion', {
                'send_to': 'AW-17859172217/AxgvCOr_194bEPmu9cNC',
                'value': value || 1.0,
                'currency': 'BRL',
                'transaction_id': transactionId
              });
              
              // Marcar como enviada
              localStorage.setItem(sentKey, 'true');
              console.log('Conversão enviada para Google Ads:', transactionId);
              return true;
            };
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
