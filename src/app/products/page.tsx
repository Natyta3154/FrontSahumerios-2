
"use client";

import { getProducts } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";

type Category = Product['category'] | 'all';
type Brand = string | 'all';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category>(initialCategory);
  const [brandFilter, setBrandFilter] = useState<Brand>('all');
  
  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return [
      { name: "Todas las Categorías", value: "all" },
      ...uniqueCategories.map(c => ({ name: c, value: c as Category }))
    ];
  }, [products]);
  
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])];
    return [
      { name: "Todas las Marcas", value: "all" },
      ...uniqueBrands.map(b => ({ name: b, value: b as Brand }))
    ];
  }, [products]);


  const filteredProducts = products.filter(product => {
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      const brandMatch = brandFilter === 'all' || product.brand === brandFilter;
      return categoryMatch && brandMatch;
  });


  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground">
          Nuestra Colección
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Explora nuestra selección curada de productos de aromaterapia, diseñados para traer equilibrio y tranquilidad a tu vida.
        </p>
      </div>
      
      <div className="flex flex-col items-center mb-12 gap-4">
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {categories.map(category => (
                <Button
                    key={category.value}
                    variant={categoryFilter === category.value ? "default" : "outline"}
                    onClick={() => {
                        setCategoryFilter(category.value);
                        setBrandFilter('all'); // Reset brand filter when category changes
                    }}
                    className="capitalize"
                >
                    {category.name}
                </Button>
            ))}
        </div>
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {brands.map(brand => (
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
    </div>
  );
}
