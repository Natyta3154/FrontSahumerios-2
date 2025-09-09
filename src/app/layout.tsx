import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Aromanza - Aromas Intensos',
  description: 'Tu santuario para la aromaterapia y el bienestar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
