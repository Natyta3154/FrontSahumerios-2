import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-headline text-2xl text-primary">AromaZen</h3>
            <p className="mt-2 text-muted-foreground">
              Your sanctuary for aromatherapy and wellness.
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
            <h4 className="font-headline text-lg">Shop</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products?category=incense" className="text-muted-foreground hover:text-primary">Incense</Link></li>
              <li><Link href="/products?category=diffusers" className="text-muted-foreground hover:text-primary">Diffusers</Link></li>
              <li><Link href="/products?category=oils" className="text-muted-foreground hover:text-primary">Essential Oils</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary">Deals</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg">Explore</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg">Newsletter</h4>
            <p className="mt-4 text-muted-foreground">
              Subscribe for wellness tips and new arrivals.
            </p>
            <form className="mt-4 flex space-x-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} AromaZen Boutique. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
