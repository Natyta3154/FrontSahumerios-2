
import { getProducts } from "@/lib/data";
import type { Product } from "@/lib/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// =================================================================================
// PÁGINA DE PRODUCTOS (REFACTORIZADA PARA RENDIMIENTO)
//
// ¿QUÉ HA CAMBIADO?
// 1. AHORA ES UN COMPONENTE DE SERVIDOR PURO: Toda la lógica de filtrado ocurre en
//    el servidor, no en el navegador. Esto es muchísimo más rápido.
// 2. LEE PARÁMETROS DE URL EN EL SERVIDOR: Se usa `searchParams` para obtener los
//    filtros de categoría y marca directamente desde la URL.
// 3. ELIMINACIÓN DE COMPONENTE CLIENTE: El antiguo componente `ProductFilters.tsx`
//    ha sido eliminado. Su lógica ahora vive aquí.
// 4. STREAMING CON SUSPENSE: La lista de productos se envuelve en <Suspense> para
//    que la página pueda hacer streaming, mostrando un esqueleto de carga mientras
//    se obtienen y renderizan los productos.
// =================================================================================

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
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
      
      {/* Suspense permite a Next.js mostrar el resto de la página inmediatamente */}
      {/* mientras este componente termina de cargar los datos. */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Este componente realiza la obtención y filtrado de datos en el servidor.
async function ProductGrid({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allProducts: Product[] = await getProducts();
  
  const categories = [...new Set(allProducts.map(p => p.category))];
  const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])];

  const categoryFilter = searchParams?.category || 'all';
  const brandFilter = searchParams?.brand || 'all';

  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
    const brandMatch = brandFilter === 'all' || product.brand === brandFilter;
    return categoryMatch && brandMatch;
  });

  return (
    <>
      {/* Filtros que ahora son simples enlaces, actualizando la URL */}
      <div className="flex flex-col items-center mb-12 gap-4">
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
          <Button asChild variant={categoryFilter === 'all' ? "default" : "outline"}>
            <Link href="/products">Todas las Categorías</Link>
          </Button>
          {categories.map(category => (
            <Button asChild key={category} variant={categoryFilter === category ? "default" : "outline"}>
              <Link href={`/products?category=${category}`} className="capitalize">{category}</Link>
            </Button>
          ))}
        </div>
        
        {categoryFilter !== 'all' && brands.length > 0 && (
           <div className="flex justify-center flex-wrap gap-2 md:gap-4">
              <Button asChild variant={brandFilter === 'all' ? "secondary" : "ghost"} size="sm">
                <Link href={`/products?category=${categoryFilter}`}>Todas las Marcas</Link>
              </Button>
              {brands.map(brand => (
                  <Button asChild key={brand} variant={brandFilter === brand ? "secondary" : "ghost"} size="sm">
                    <Link href={`/products?category=${categoryFilter}&brand=${brand}`} className="capitalize">{brand}</Link>
                  </Button>
              ))}
           </div>
        )}
      </div>

      {/* Grid de productos renderizado en el servidor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group flex flex-col">
            <CardHeader className="p-0">
               <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

// Componente de esqueleto para el fallback de Suspense.
function ProductGridSkeleton() {
  return (
    <div>
      <div className="flex flex-col items-center mb-12 gap-4">
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-6 w-3/4 mt-2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
