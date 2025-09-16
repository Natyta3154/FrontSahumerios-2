
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  React.useEffect(() => {
    if (!user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const searchParams = typeof window !== 'undefined' ? window.location.search : '';
      const nextUrl = `/login?next=${encodeURIComponent(currentPath + searchParams)}`;
      router.replace(nextUrl);
    }
  }, [user, router]);


  const shippingCost = total > 0 ? 5.00 : 0;
  const grandTotal = total + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user || !token) {
        toast({
            title: "Error de autenticación",
            description: "Debes iniciar sesión para realizar un pedido.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);

    try {
        const pedidoRequest = {
            usuarioId: user.id,
            items: cartItems.map(item => ({
                productoId: Number(item.id),
                cantidad: item.quantity
            }))
        };

        const response = await fetch('https://apisahumerios.onrender.com/pedidos/realizarPedidoConPago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoRequest)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear el pedido.');
        }

        const paymentUrl = data.preferenciaId;

        if (paymentUrl) {
            clearCart();
            // Redirección directa a la URL de pago de Mercado Pago
            window.location.href = paymentUrl;
        } else {
             throw new Error("No se recibió la URL de pago.");
        }

    } catch (error) {
        toast({
            title: "Error al procesar el pago",
            description: (error as Error).message,
            variant: "destructive"
        });
        setIsLoading(false);
    }
    // No se pone setIsLoading(false) aquí porque el usuario será redirigido.
  };
  
  if (!user) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="font-headline text-2xl">Redirigiendo a la página de login...</h1>
        </div>
    )
  }

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="font-headline text-4xl mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">No puedes proceder al pago sin artículos en tu carrito.</p>
            <Button asChild>
                <Link href="/products">Seguir comprando</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* Lado Izquierdo: Formularios de Envío y Pago */}
        <div>
          <h1 className="font-headline text-3xl mb-6">Checkout</h1>
          <div className="space-y-8">
            
            {/* Información de Contacto */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-headline text-xl mb-4">Información de Contacto</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" defaultValue={user.email} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dirección de Envío */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-headline text-xl mb-4">Dirección de Envío</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="full-name">Nombre Completo</Label>
                    <Input id="full-name" placeholder="John Doe" defaultValue={user.nombre} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Serenity City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado / Provincia</Label>
                    <Input id="state" placeholder="California" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Código Postal</Label>
                    <Input id="zip" placeholder="90210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Método de Pago (Simplificado) */}
             <Card>
              <CardContent className="pt-6">
                 <h2 className="font-headline text-xl mb-4">Método de Pago</h2>
                 <p className="text-sm text-muted-foreground">
                   Serás redirigido a Mercado Pago para completar tu compra de forma segura al hacer clic en "Realizar Pedido".
                 </p>
               </CardContent>
            </Card>

          </div>
        </div>

        {/* Lado Derecho: Resumen del Pedido */}
        <div className="bg-card p-8 rounded-lg h-fit sticky top-24">
          <h2 className="font-headline text-2xl mb-6">Resumen del Pedido</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={handlePlaceOrder} disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Realizar Pedido'}
          </Button>
        </div>
      </div>
    </div>
  );
}
