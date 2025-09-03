
"use client";

import { getProducts } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";

export default function DealsPage() {
  const [dealProducts, setDealProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDealProducts = async () => {
      const allProducts = await getProducts();
      setDealProducts(allProducts.filter(p => p.onSale));
    };
    fetchDealProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground">
          Special Offers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Don't miss out on these limited-time deals on your favorite aromatherapy products.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {dealProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group flex flex-col">
            <CardHeader className="p-0">
               <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge variant="destructive" className="absolute top-3 right-3">DEAL</Badge>
               </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                <CardTitle className="font-headline text-xl mb-2 h-14">
                    {product.name}
                </CardTitle>
              </Link>
               {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-lg text-destructive">
                  ${product.price.toFixed(2)}
                </p>
                {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                    </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
