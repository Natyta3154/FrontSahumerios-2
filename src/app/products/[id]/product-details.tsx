"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';

function ProductRating({ rating, reviews }: { rating: number; reviews: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />
        ))}
        {halfStar && <StarHalf className="h-5 w-5 fill-primary text-primary" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground/50" />
        ))}
      </div>
      <span className="text-muted-foreground text-sm">({reviews} reseñas)</span>
    </div>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedAroma, setSelectedAroma] = useState<string | undefined>(product.aromas?.[0]);

  const handleAddToCart = () => {
    let productToAdd = { ...product };
    if (selectedAroma) {
      productToAdd.name = `${product.name} - ${selectedAroma}`;
    }
    addToCart(productToAdd as Product);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <div>
          <Link href={`/products?category=${product.category}`} className="text-sm font-medium text-primary uppercase hover:underline">{product.category}</Link>
          <h1 className="font-headline text-4xl md:text-5xl mt-2">{product.name}</h1>
          {product.brand && (
            <p className="text-xl text-muted-foreground mt-2">de <Link href={`/products?brand=${product.brand}`} className="hover:underline">{product.brand}</Link></p>
          )}
          <div className="mt-4">
            <ProductRating rating={product.rating} reviews={product.reviews} />
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-baseline gap-2">
                <p className={`font-bold text-3xl ${product.onSale ? 'text-destructive' : 'text-foreground'}`}>
                ${product.price.toFixed(2)}
                </p>
                {product.onSale && product.originalPrice && (
                <p className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                </p>
                )}
            </div>
            {product.precioMayorista && (
                <div className="flex items-baseline gap-2">
                    <p className="text-lg font-semibold text-muted-foreground">Precio Mayorista:</p>
                    <p className="font-bold text-xl text-foreground">${product.precioMayorista.toFixed(2)}</p>
                </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4 text-lg text-muted-foreground">
          <p>{product.description}</p>
        </div>

        <div className="mt-8 flex items-center gap-4">
          {product.aromas && product.aromas.length > 0 && (
            <Select value={selectedAroma} onValueChange={setSelectedAroma}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Aroma" />
              </SelectTrigger>
              <SelectContent>
                {product.aromas.map(aroma => (
                  <SelectItem key={aroma} value={aroma}>{aroma}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
