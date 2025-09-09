
import { getProducts } from "@/lib/data";
import { ProductFilters } from "./product-filters";
import type { Product } from "@/lib/types";

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
      <ProductFilters
        products={allProducts}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}

