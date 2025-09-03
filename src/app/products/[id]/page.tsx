
"use client";

import { getProductById, getProducts } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, StarHalf } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/types';


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
  const [product, setProduct] = useState<Product | null | undefined>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [selectedAroma, setSelectedAroma] = React.useState<string | undefined>();
  
  useEffect(() => {
    if (typeof params.id !== 'string') return;
    
    const fetchProductData = async () => {
      const fetchedProduct = await getProductById(params.id as string);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        setSelectedAroma(fetchedProduct.aromas?.[0]);
        const allProducts = await getProducts();
        const related = allProducts.filter(p => p.category === fetchedProduct.category && p.id !== fetchedProduct.id).slice(0, 4);
        setRelatedProducts(related);
      }
    };
    
    fetchProductData();

  }, [params.id]);


  if (product === null) {
    // Loading state
    return <div>Loading...</div>;
  }
  
  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    let productToAdd = { ...product };
    if (selectedAroma) {
      productToAdd.name = `${product.name} - ${selectedAroma}`;
    }
    addToCart(productToAdd as Product);
  };

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
            <Link href={`/products?category=${product.category}`} className="text-sm font-medium text-primary uppercase hover:underline">{product.category}</Link>
            <h1 className="font-headline text-4xl md:text-5xl mt-2">{product.name}</h1>
            {product.brand && (
                <p className="text-xl text-muted-foreground mt-2">by <Link href={`/products?brand=${product.brand}`} className="hover:underline">{product.brand}</Link></p>
            )}
            <div className="mt-4">
              <ProductRating rating={product.rating} reviews={product.reviews} />
            </div>
             <div className="flex items-baseline gap-2 mt-4">
                <p className={`font-bold text-3xl ${product.onSale ? 'text-destructive' : 'text-foreground'}`}>
                    ${product.price.toFixed(2)}
                </p>
                {product.onSale && product.originalPrice && (
                    <p className="text-xl text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                    </p>
                )}
              </div>
          </div>
          
          <Separator className="my-6" />

          <div className="space-y-4 text-lg text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {product.aromas && product.aromas.length > 0 && (
                <Select value={selectedAroma} onValueChange={setSelectedAroma}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Aroma" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.aromas.map(aroma => (
                      <SelectItem key={aroma} value={aroma}>{aroma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
       <Separator className="my-16" />

      {/* Related Products Section */}
      <div>
          <h2 className="font-headline text-3xl text-center mb-8">You Might Also Like</h2>
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
                              <Link href={`/products/${relatedProduct.id}`}>View Details</Link>
                          </Button>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      </div>
    </div>
  );
}
