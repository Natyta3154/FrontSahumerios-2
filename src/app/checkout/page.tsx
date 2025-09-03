
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CreditCard, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const shippingCost = total > 0 ? 5.00 : 0;
  const grandTotal = total + shippingCost;

  const handlePlaceOrder = () => {
    // In a real application, you would process the payment here.
    alert("Order placed successfully!");
    clearCart();
    // Redirect to a confirmation page, e.g., router.push('/order-confirmation');
  };
  
  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="font-headline text-4xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">You can't checkout without any items in your cart.</p>
            <Button asChild>
                <Link href="/products">Continue Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* Left Side: Shipping and Payment Forms */}
        <div>
          <h1 className="font-headline text-3xl mb-6">Checkout</h1>
          <div className="space-y-8">
            
            {/* Contact Information */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-headline text-xl mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-headline text-xl mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Serenity City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="California" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" placeholder="90210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
             <Card>
              <CardContent className="pt-6">
                 <h2 className="font-headline text-xl mb-4">Payment Method</h2>
                 <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                           <div className="flex items-center gap-2">
                             <CreditCard className="h-5 w-5" /> Credit Card
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <div className="space-y-4">
                               <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" placeholder="**** **** **** 1234" />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                     <Label htmlFor="expiry-date">Expiration Date</Label>
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
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10h10"/><path d="M10.4 2.1c.3-.2.7-.2 1 0l4.3 2.9c.3.2.5.5.5.9v10.2c0 .4-.2.7-.5.9l-4.3 2.9c-.3.2-.7.2-1 0l-4.3-2.9a1 1 0 0 1-.5-.9V3c0-.4.2-.7.5-.9Z"/><path d="m3.5 7.1.9-.6 4.3 2.9-1 .6z"/><path d="m20.5 7.1-.9-.6-4.3 2.9 1 .6z"/><path d="M12 22v-5.5L5.5 13Z"/><path d="M12 16.5 18.5 13Z"/></svg>
                             PayPal
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pt-4 text-center">
                                <p className="text-muted-foreground">You will be redirected to PayPal to complete your purchase.</p>
                                <Button variant="outline" className="mt-4">Continue with PayPal</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
               </CardContent>
            </Card>

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-card p-8 rounded-lg h-fit sticky top-24">
          <h2 className="font-headline text-2xl mb-6">Order Summary</h2>
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
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
