
"use client";

import { products } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, StarHalf } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import { use } from 'react';

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
      <span className="text-muted-foreground text-sm">({reviews} reviews)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }
  
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
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
            <span className="text-sm font-medium text-primary uppercase">{product.category}</span>
            <h1 className="font-headline text-4xl md:text-5xl mt-2">{product.name}</h1>
            {product.brand && (
                <p className="text-xl text-muted-foreground mt-2">by {product.brand}</p>
            )}
            <div className="mt-4">
              <ProductRating rating={product.rating} reviews={product.reviews} />
            </div>
            <p className="mt-4 text-3xl font-bold">${product.price.toFixed(2)}</p>
          </div>
          
          <Separator className="my-6" />

          <div className="space-y-4 text-lg text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="mt-8">
            <Button size="lg" className="w-full md:w-auto" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
