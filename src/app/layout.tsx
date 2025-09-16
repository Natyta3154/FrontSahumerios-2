import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import Script from 'next/script';

// =================================================================================
// LAYOUT RAÍZ (ROOT LAYOUT)
// Este es el componente principal que envuelve a TODA la aplicación.
//
// ¿QUÉ HACE?
// 1. Define la estructura HTML base (<html>, <body>).
// 2. Importa y aplica los estilos globales de `globals.css`.
// 3. Carga las fuentes de Google Fonts.
// 4. Incluye el SDK de Mercado Pago.
// 5. Envuelve la aplicación en los "Proveedores de Contexto" (`AuthProvider`, `CartProvider`),
//    haciendo que el estado de autenticación y del carrito esté disponible en todas las páginas.
// 6. Renderiza el Header, el Footer y el `Toaster` (para notificaciones).
// =================================================================================


// --- Metadatos de la Aplicación ---
// Define el título y la descripción por defecto para el SEO.
export const metadata: Metadata = {
  title: 'Aromanza - Aromas Intensos',
  description: 'Tu santuario para la aromaterapia y el bienestar.',
};

export default function RootLayout({
  children, // `children` será el contenido de la página actual que se esté visitando.
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` es útil para evitar advertencias cuando se usan
    // extensiones de navegador que modifican el HTML.
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Carga de las fuentes desde Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        
        {/* CONEXIÓN EXTERNA: Carga el SDK de Mercado Pago. */}
        {/* `strategy="beforeInteractive"` hace que el script se cargue antes de que la página sea interactiva. */}
        <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
      </head>
      <body className="font-body antialiased">
        {/* --- PROVEEDORES DE CONTEXTO --- */}
        {/* `AuthProvider` gestiona el estado del usuario (login, logout). */}
        <AuthProvider>
          {/* `CartProvider` gestiona el estado del carrito de compras. */}
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {/* Componente de cabecera */}
              <AppHeader />
              {/* `main` contendrá el contenido principal de cada página. */}
              <main className="flex-grow">{children}</main>
              {/* Componente de pie de página */}
              <AppFooter />
            </div>
            {/* `Toaster` es el componente que renderiza las notificaciones emergentes (toasts). */}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
