
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flower2, Menu, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { CartSheet } from "../cart-sheet";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const pathname = usePathname();
  const { cartItems, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/deals", label: "Ofertas" },
    { href: "/about", label: "Nosotros" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Flower2 className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-primary">
              AromaZen
            </span>
          </Link>
          
          <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Cuenta de usuario">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.rol === 'ROLE_ADMIN' && (
                     <DropdownMenuItem asChild>
                       <Link href="/admin/dashboard">Panel de Admin</Link>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" passHref>
                <Button variant="ghost" size="icon" aria-label="Iniciar sesión">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <div className="md:hidden">
               <Sheet>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon">
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">Abrir Menú</span>
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="left">
                    <div className="flex flex-col p-6">
                      <Link href="/" className="mb-6 flex items-center space-x-2">
                        <Flower2 className="h-7 w-7 text-primary" />
                        <span className="font-headline text-2xl font-bold text-primary">AromaZen</span>
                      </Link>
                      <nav className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "text-lg transition-colors hover:text-primary",
                              pathname === link.href ? "text-primary font-semibold" : "text-foreground"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                 </SheetContent>
               </Sheet>
            </div>

          </div>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
