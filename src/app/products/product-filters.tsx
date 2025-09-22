
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";

type Category = Product['category'] | 'all';
type Brand = string | 'all';

// 1. Este componente es un Componente de Cliente.
// Maneja el estado, los filtros y la interacción del usuario.
export function ProductFilters({ products, categories, brands }: { products: Product[], categories: string[], brands: string[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category || 'all';

  const [categoryFilter, setCategoryFilter] = useState<Category>(initialCategory);
  const [brandFilter, setBrandFilter] = useState<Brand>('all');
  
  // 2. Los datos de filtros se construyen a partir de las props.
  const categoryOptions = useMemo(() => {
    return [
      { name: "Todas las Categorías", value: "all" },
      ...categories.map(c => ({ name: c, value: c as Category }))
    ];
  }, [categories]);
  
  const brandOptions = useMemo(() => {
    return [
      { name: "Todas las Marcas", value: "all" },
      ...brands.map(b => ({ name: b, value: b as Brand }))
    ];
  }, [brands]);

  // 3. La lógica de filtrado se aplica sobre la lista completa de productos.
  const filteredProducts = useMemo(() => products.filter(product => {
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      const brandMatch = brandFilter === 'all' || product.brand === brandFilter;
      return categoryMatch && brandMatch;
  }), [products, categoryFilter, brandFilter]);


  return (
    <>
      <div className="flex flex-col items-center mb-12 gap-4">
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {categoryOptions.map(category => (
                <Button
                    key={category.value}
                    variant={categoryFilter === category.value ? "default" : "outline"}
                    onClick={() => {
                        setCategoryFilter(category.value);
                        setBrandFilter('all'); 
                    }}
                    className="capitalize"
                >
                    {category.name}
                </Button>
            ))}
        </div>
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {brandOptions.map(brand => (
                <Button
                    key={brand.value}
                    variant={brandFilter === brand.value ? "secondary" : "ghost"}
                    onClick={() => setBrandFilter(brand.value)}
                    className="capitalize"
                    size="sm"
                >
                    {brand.name}
                </Button>
            ))}
        </div>
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
              <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                <CardTitle className="font-headline text-xl mb-2 h-14">
                    {product.name}
                </CardTitle>
              </Link>
               {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              )}
               <div className="flex items-baseline gap-2">
                <p className={`font-bold text-lg ${product.onSale ? 'text-destructive' : 'text-foreground'}`}>
                    ${product.price.toFixed(2)}
                </p>
                {product.onSale && product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                    </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>Ver Detalles</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
