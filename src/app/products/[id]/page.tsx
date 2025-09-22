// src/app/products/[id]/page.tsx
import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ProductDetails } from './product-details';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

interface ProductPageProps {
  params: { id: string | string[] };
}

// ✅ La clave es desestructurar `params` **dentro del componente async**
export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Esperamos el valor real de id
  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;

  if (!id) {
    notFound();
  }

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts: Product[] = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <ProductDetails product={product} />

      <Separator className="my-16" />

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-headline text-3xl text-center mb-8">También te podría gustar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((related) => (
              <Card key={related.id} className="overflow-hidden group flex flex-col">
                <CardHeader className="p-0">
                  <Link href={`/products/${related.id}`} className="block overflow-hidden aspect-square relative">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Link href={`/products/${related.id}`} className="hover:text-primary transition-colors">
                    <CardTitle className="font-headline text-lg mb-2 h-12 line-clamp-2">{related.name}</CardTitle>
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <p className={`font-bold text-lg ${related.onSale ? 'text-destructive' : 'text-foreground'}`}>
                      ${related.price.toFixed(2)}
                    </p>
                    {related.onSale && related.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">${related.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/products/${related.id}`}>Ver Detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
