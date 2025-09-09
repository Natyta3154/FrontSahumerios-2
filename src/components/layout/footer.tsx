
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { LotusIcon } from "@/components/icons/lotus-icon";

export function AppFooter() {
  return (
    <footer className="bg-background/80 text-foreground border-t border-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
                <LotusIcon className="h-7 w-7 text-primary" />
                <h3 className="font-headline text-2xl text-primary">Aromanza</h3>
            </div>
            <p className="mt-2 text-muted-foreground">
              Tu santuario para la aromaterapia y el bienestar.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg">Tienda</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products?category=incense" className="text-muted-foreground hover:text-primary">Incienso</Link></li>
              <li><Link href="/products?category=diffusers" className="text-muted-foreground hover:text-primary">Difusores</Link></li>
              <li><Link href="/products?category=oils" className="text-muted-foreground hover:text-primary">Aceites Esenciales</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary">Ofertas</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Todos los Productos</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg">Explorar</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Nosotros</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg">Boletín</h4>
            <p className="mt-4 text-muted-foreground">
              Suscríbete para recibir consejos de bienestar y novedades.
            </p>
            <form className="mt-4 flex space-x-2">
              <Input type="email" placeholder="Tu email" className="flex-1" />
              <Button type="submit">Suscribirse</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Aromanza. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-primary">Política de Privacidad</Link>
            <span>&bull;</span>
            <Link href="/terms-of-service" className="hover:text-primary">Términos de Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
