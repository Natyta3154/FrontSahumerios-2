import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductDetails } from './product-details';
import { Button } from '@/components/ui/button';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  if (typeof params.id !== 'string') {
    notFound();
  }

  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <ProductDetails product={product} />
      
      <Separator className="my-16" />

      {/* Sección de Productos Relacionados */}
      <div>
        <h2 className="font-headline text-3xl text-center mb-8">También te podría gustar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id} className="overflow-hidden group flex flex-col">
              <CardHeader className="p-0">
                <Link href={`/products/${relatedProduct.id}`} className="block overflow-hidden aspect-square relative">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Link href={`/products/${relatedProduct.id}`} className="hover:text-primary transition-colors">
                  <CardTitle className="font-headline text-lg mb-2 h-12">
                    {relatedProduct.name}
                  </CardTitle>
                </Link>
                <div className="flex items-baseline gap-2">
                  <p className={`font-bold text-md ${relatedProduct.onSale ? 'text-destructive' : 'text-foreground'}`}>
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                  {relatedProduct.onSale && relatedProduct.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${relatedProduct.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/products/${relatedProduct.id}`}>Ver Detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
