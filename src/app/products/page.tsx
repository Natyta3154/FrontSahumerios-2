
import { getProducts } from "@/lib/data";
import { ProductFilters } from "./product-filters";
import type { Product } from "@/lib/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Esta página ahora es un Componente de Servidor.
// Se ejecuta en el servidor en cada solicitud, obteniendo datos frescos.
export default async function ProductsPage() {
  
  // 2. Obtenemos los productos directamente en el servidor.
  // Si esto falla, Next.js mostrará una página de error.
  const allProducts: Product[] = await getProducts();

  // 3. Extraemos las categorías y marcas únicas para los filtros.
  const categories = [...new Set(allProducts.map(p => p.category))];
  const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])];

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
      
      {/* 4. Pasamos los datos al componente cliente que manejará la interactividad. */}
      {/*    Envolvemos el componente en Suspense para que useSearchParams funcione correctamente. */}
      <Suspense fallback={<FiltersSkeleton />}>
        <ProductFilters
          products={allProducts}
          categories={categories}
          brands={brands}
        />
      </Suspense>
    </div>
  );
}

// Componente de esqueleto para mostrar mientras se cargan los filtros
function FiltersSkeleton() {
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
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
