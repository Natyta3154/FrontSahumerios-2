
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
import React from "react";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

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

  const handlePlaceOrder = () => {
    // NOTA PARA EL DESARROLLADOR:
    // Aquí es donde se debe iniciar el proceso de pago.
    // 1. Recopilar la información del formulario.
    // 2. Enviar los detalles del pedido y la información de pago a tu backend.
    // 3. Tu backend se comunica con Mercado Pago / procesador de tarjetas.
    // 4. Al recibir la confirmación del backend, se muestra un mensaje de éxito.
    alert("¡Pedido realizado con éxito! (Simulación)");
    clearCart();
    router.push('/');
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
                    <Input id="email" type="email" placeholder="tu@email.com" defaultValue={user.email} />
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
            
            {/* Método de Pago */}
             <Card>
              <CardContent className="pt-6">
                 <h2 className="font-headline text-xl mb-4">Método de Pago</h2>
                 <p className="text-sm text-muted-foreground mb-4">El procesamiento final del pago debe ser manejado por tu backend por seguridad.</p>
                 <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                           <div className="flex items-center gap-2">
                             <CreditCard className="h-5 w-5" /> Pagar con Tarjeta de Crédito/Débito
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <div className="space-y-4">
                               <div className="space-y-2">
                                <Label htmlFor="card-number">Número de Tarjeta</Label>
                                <Input id="card-number" placeholder="**** **** **** 1234" />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                     <Label htmlFor="expiry-date">Fecha de Expiración</Label>
                                     <Input id="expiry-date" placeholder="MM/YY" />
                                   </div>
                                   <div className="space-y-2">
                                     <Label htmlFor="cvc">CVC</Label>
                                     <Input id="cvc" placeholder="123" />
                                   </div>
                               </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                         <AccordionTrigger>
                           <div className="flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 176" fill="none">
                               <path d="M222.991 3.5249C221.733 2.5029 220.088 2.0549 218.442 2.1779L37.555 16.3409C35.43 16.5099 33.642 17.5899 32.553 19.3369C31.464 21.0839 31.183 23.2399 31.785 25.2289L44.823 74.0729H31.542C30.453 74.0729 29.391 74.4539 28.539 75.1489C27.687 75.8439 27.102 76.8049 26.883 77.8929L20.106 111.2339C19.866 112.4419 20.076 113.7029 20.694 114.7779C21.312 115.8519 22.302 116.6669 23.448 117.0659L50.418 126.1139C51.687 126.5629 53.076 126.5629 54.345 126.1139L81.315 117.0659C82.461 116.6669 83.451 115.8519 84.069 114.7779C84.687 113.7029 84.897 112.4419 84.657 111.2339L77.88 77.8929C77.661 76.8049 77.076 75.8439 76.224 75.1489C75.372 74.4539 74.31 74.0729 73.221 74.0729H60.183L49.122 32.1839L209.613 19.4679L222.99 3.5249Z" fill="#00AEEF"/>
                               <path d="M222.991 3.5249L209.613 19.4679L228.618 122.9939L235.143 125.6819C236.262 126.1019 237.495 126.0679 238.641 125.5929C239.787 125.1179 240.768 124.2309 241.407 123.0909L254.214 100.9579C255.456 98.8879 255.465 96.2899 254.238 94.2139L222.991 3.5249Z" fill="#009EE3"/>
                               <path d="M129.92 108.337C129.795 108.143 129.645 107.977 129.477 107.839C124.293 103.55 118.053 101.402 110.763 101.402C102.579 101.402 95.343 103.957 89.043 108.337C88.869 108.475 88.677 108.628 88.467 108.766L89.475 125.54L128.637 125.267L129.92 108.337Z" fill="#233F89"/>
                               <path d="M165.861 101.402C158.571 101.402 152.331 103.55 147.147 107.839C146.979 107.977 146.829 108.143 146.703 108.337L147.288 125.404C147.315 125.404 147.333 125.413 147.351 125.413C152.373 120.985 158.553 118.591 165.312 118.591C167.319 118.591 169.269 118.789 171.126 119.161L173.313 102.502C171.042 101.807 168.498 101.402 165.861 101.402Z" fill="#233F89"/>
                               <path d="M110.763 118.591C103.995 118.591 97.824 120.985 92.802 125.413H92.811L92.226 108.337C92.1 108.143 91.95 107.977 91.782 107.839C97.068 103.55 103.308 101.402 110.598 101.402C113.235 101.402 115.779 101.807 118.05 102.502L120.237 119.161C117.033 118.789 113.913 118.591 110.763 118.591Z" fill="#00AEEF"/>
                               <path d="M147.288 125.404L128.637 125.267L129.92 108.337C135.216 103.957 142.452 101.402 150.636 101.402C153.381 101.402 156.033 101.843 158.532 102.628L147.288 125.404Z" fill="#009EE3"/>
                             </svg>
                             Pagar con Mercado Pago
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pt-4 text-center">
                                <p className="text-muted-foreground">Serás redirigido a Mercado Pago para completar tu compra de forma segura.</p>
                                <Button variant="outline" className="mt-4 bg-[#00AEEF] text-white hover:bg-[#009EE3]">
                                  Continuar con Mercado Pago
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
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
          <Button size="lg" className="w-full mt-6" onClick={handlePlaceOrder}>
            Realizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
