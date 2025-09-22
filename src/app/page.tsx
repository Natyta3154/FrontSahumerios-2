import { HomeCarousel } from "./home-carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getProductsOnDeal, blogArticles } from "@/app/lib/data";
import { ArrowRight, Star } from "lucide-react";
import type { Product } from "@/app/lib/types";

// COMPONENTE PRODUCTOS DESTACADOS
function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <>
      {products.length
        ? products.map((product, index) => (
            <Card key={product.id} className="overflow-hidden group flex flex-col">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index === 0}
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                  <CardTitle className="font-headline text-xl mb-2 h-14 line-clamp-2">{product.name}</CardTitle>
                </Link>
                <div className="flex items-baseline gap-2">
                  <p className={`font-bold text-lg ${product.onSale ? 'text-destructive' : 'text-foreground'}`}>
                    ${product.price.toFixed(2)}
                  </p>
                  {product.onSale && product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/products/${product.id}`}>Ver Detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        : Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden group flex flex-col animate-pulse">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
    </>
  );
}


// COMPONENTE PRODUCTOS EN OFERTA
function SaleProducts({ products }: { products: Product[] }) {
  return (
    <CarouselContent>
      {products.length
        ? products.map((product, index) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1 h-full">
                <Card className="overflow-hidden group flex flex-col h-full">
                  <CardHeader className="p-0">
                    <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={index < 4}
                      />
                      <Badge variant="destructive" className="absolute top-3 right-3">OFERTA</Badge>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                      <CardTitle className="font-headline text-xl mb-2 h-14 line-clamp-2">{product.name}</CardTitle>
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-lg text-destructive">${product.price.toFixed(2)}</p>
                      {product.onSale && product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/products/${product.id}`}>Ver Producto</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))
        : Array.from({ length: 4 }).map((_, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1 h-full">
                <Card className="overflow-hidden group flex flex-col h-full animate-pulse">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
    </CarouselContent>
  );
}


// HOME PAGE SERVER COMPONENT
export default async function Home() {
  // Fetch de productos y ofertas en paralelo
  const [allProducts, saleProductsData] = await Promise.all([
    getProducts(),
    getProductsOnDeal(),
  ]);

  const featuredProducts = allProducts.slice(0, 3);
  const saleProducts = saleProductsData.slice(0, 8);

  const testimonials = [
    { name: "Ana L.", rating: 5, comment: "Totalmente enamorada del aceite de lavanda.", image: "https://picsum.photos/100/100?random=13" },
    { name: "Miguel B.", rating: 5, comment: "El difusor de cerámica no solo es hermoso, sino que funciona a la perfección.", image: "https://picsum.photos/100/100?random=14" },
    { name: "Jéssica P.", rating: 4, comment: "Gran selección de inciensos. El de sándalo es mi favorito.", image: "https://picsum.photos/100/100?random=15" }
  ];

  return (
    <div className="flex flex-col">
      <HomeCarousel />

      {/* Filosofía */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-headline text-3xl md:text-4xl text-foreground">Nuestra Filosofía</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            En Aromanza, creemos en el poder del aroma para transformar espacios y elevar el ánimo.
          </p>
        </div>
      </section>

      {/* Ofertas */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Nuestras Ofertas</h2>
            <p className="mt-2 text-lg text-muted-foreground">Aprovecha estos descuentos por tiempo limitado.</p>
          </div>
          <Carousel opts={{ align: "start", loop: saleProducts.length > 4 }} className="w-full">
            <SaleProducts products={saleProducts} />
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl">Productos Destacados</h2>
          <p className="mt-2 text-lg text-muted-foreground">Explora nuestros productos más populares.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">De Nuestro Blog</h2>
            <p className="mt-2 text-lg text-muted-foreground">Ideas e historias del mundo de la aromaterapia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogArticles.slice(0, 3).map((article, index) => (
              <Card key={article.slug} className="overflow-hidden group">
                <Link href={`/blog/${article.slug}`}>
                  <CardHeader className="p-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index === 0}
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">{article.summary}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/blog">Leer Más <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex flex-col items-center p-8">
              <Image src={t.image} alt={t.name} width={80} height={80} className="rounded-full" loading={i > 0 ? "lazy" : "eager"} />
              <div className="flex mt-4 mb-2">
                {[...Array(5)].map((_, starIdx) => (
                  <Star key={starIdx} className={`h-5 w-5 ${starIdx < t.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                ))}
              </div>
              <CardContent className="p-0">
                <p className="text-muted-foreground italic">&quot;{t.comment}&quot;</p>
                <p className="mt-4 font-semibold text-foreground">- {t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
