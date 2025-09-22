import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/header";
import { AppFooter } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import Script from "next/script";
import { Montserrat, Playfair_Display } from "next/font/google";

// =================================================================================
// FUENTES CON NEXT/FONT
// Se cargan en CSS de forma optimizada, con "display: swap" por defecto.
// =================================================================================
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

// --- Metadatos de la Aplicación ---
export const metadata: Metadata = {
  title: "Aromanza - Aromas Intensos",
  description: "Tu santuario para la aromaterapia y el bienestar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* SDK de Mercado Pago */}
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} font-body antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-grow">{children}</main>
              <AppFooter />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
