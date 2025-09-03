"use client";

import { products } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";

type Category = Product['category'] | 'all';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category || 'all';
  const [filter, setFilter] = useState<Category>(initialCategory);

  const filteredProducts = products.filter(
    (product) => filter === "all" || product.category === filter
  );

  const categories: { name: string, value: Category }[] = [
    { name: "All", value: "all" },
    { name: "Incense", value: "incense" },
    { name: "Diffusers", value: "diffusers" },
    { name: "Essential Oils", value: "oils" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground">
          Our Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our curated selection of aromatherapy products, designed to bring balance and tranquility to your life.
        </p>
      </div>
      
      <div className="flex justify-center mb-8 gap-2 md:gap-4">
        {categories.map(category => (
            <Button
                key={category.value}
                variant={filter === category.value ? "default" : "outline"}
                onClick={() => setFilter(category.value)}
                className="capitalize"
            >
                {category.name}
            </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group flex flex-col">
            <CardHeader className="p-0">
               <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
               </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="font-headline text-xl mb-2 h-14">
                <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
              </CardTitle>
              <CardDescription className="font-bold text-lg text-foreground">
                ${product.price.toFixed(2)}
              </CardDescription>
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
