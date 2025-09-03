
"use client" // Este comentario indica que este componente se ejecuta en el cliente (navegador).

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// Importamos los datos de muestra. En una aplicación real, estos datos vendrían de una llamada a tu backend.
import { getProducts, blogArticles } from "@/lib/data";
import { ArrowRight, Brain, Leaf, Star, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay"; // Importamos el plugin de autoplay para el carrusel.
import React from "react";
import { Product } from "@/lib/types";

export default function Home() {

  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setFeaturedProducts(allProducts.slice(0,3));
    }
    fetchProducts();
  }, [])

  // Datos para la sección de beneficios. Pueden ser estáticos o venir del backend si se desea.
  const benefits = [
    {
      icon: <Wind className="h-10 w-10 text-primary" />,
      title: "Relajación",
      description: "Nuestros productos ayudan a calmar la mente y el cuerpo, reduciendo el estrés y la ansiedad.",
    },
    {
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: "Ingredientes Naturales",
      description: "Elaborados con los mejores botánicos y aceites esenciales de origen ético.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Concentración Mejorada",
      description: "Ciertos aromas pueden agudizar tu enfoque y potenciar tu rendimiento cognitivo.",
    },
  ];

  // Datos para la sección de testimonios. Idealmente, estos vendrían de tu base de datos.
  const testimonials = [
    {
      name: "Ana L.",
      rating: 5,
      comment: "Totalmente enamorada del aceite de lavanda. Ha transformado por completo mi rutina de sueño. ¡La calidad es inigualable!",
      image: "https://picsum.photos/100/100?random=13"
    },
    {
      name: "Miguel B.",
      rating: 5,
      comment: "El difusor de cerámica no solo es hermoso, sino que funciona a la perfección. Mi hogar nunca se ha sentido tan sereno. Muy recomendado.",
      image: "https://picsum.photos/100/100?random=14"
    },
    {
      name: "Jéssica P.",
      rating: 4,
      comment: "Gran selección de inciensos. El de sándalo es mi favorito para mis sesiones de yoga matutinas. El aroma es tan auténtico.",
      image: "https://picsum.photos/100/100?random=15"
    }
  ];
  
  // Creamos una referencia para el plugin de autoplay del carrusel.
  // Esto nos permite controlar el carrusel si es necesario (pausar, reanudar, etc.).
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col">
      {/* --- SECCIÓN PRINCIPAL (HERO CAROUSEL) --- */}
      {/* Esta sección muestra un carrusel de imágenes a pantalla completa con un llamado a la acción. */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        {/* 
          Componente Carousel de ShadCN:
          - `plugins={[plugin.current]}`: Activa el plugin de autoplay.
          - `opts={{ loop: true }}`: Hace que el carrusel sea infinito.
          - `onMouseEnter`, `onMouseLeave`: Pausa y reanuda el autoplay cuando el usuario interactúa.
        */}
        <Carousel 
          className="w-full h-full" 
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-full">
            {/* Cada `CarouselItem` es una diapositiva. Las imágenes son de un servicio de placeholders. */}
            {/* Para conectar tu backend, reemplazarías las URLs de `src` con las de tus imágenes. */}
            <CarouselItem className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src="https://picsum.photos/1600/900"
                  alt="Varita de incienso brillante"
                  data-ai-hint="incense stick"
                  fill
                  className="object-cover"
                />
                {/* Capa semitransparente para oscurecer la imagen y hacer el texto legible. */}
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src="https://picsum.photos/1600/901"
                  alt="Difusor de aceite aromático"
                  data-ai-hint="oil diffuser"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src="https://picsum.photos/1600/902"
                  alt="Botellas de aceite esencial"
                  data-ai-hint="essential oils"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
          </CarouselContent>
          {/* Controles de navegación del carrusel, ocultos en móviles. */}
          <div className="hidden md:block">
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
        {/* Contenido de texto superpuesto en el carrusel. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
            Encuentra Tu Paz Interior
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Descubre el arte de la aromaterapia con nuestra colección curada de inciensos, difusores y aceites esenciales.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/products">Comprar Ahora</Link>
          </Button>
        </div>
      </section>

      {/* --- SECCIÓN DE FILOSOFÍA --- */}
      {/* Un bloque simple para comunicar la misión de la marca. */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground">Nuestra Filosofía</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              En AromaZen, creemos en el poder del aroma para transformar espacios y elevar el ánimo. Nos dedicamos a ofrecer productos naturales de alta calidad que promueven el bienestar y la serenidad en tu vida diaria.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE PRODUCTOS DESTACADOS --- */}
      {/* Muestra una selección de productos. Los datos vienen de `featuredProducts`. */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Productos Destacados</h2>
            <p className="mt-2 text-lg text-muted-foreground">Selecciones exclusivas para comenzar tu viaje.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 
              Se itera sobre el array `featuredProducts` para renderizar cada tarjeta de producto.
              Para conectar tu backend, aquí harías un fetch de tus productos destacados y los pasarías a este componente.
            */}
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <CardHeader className="p-0">
                  <Link href={`/products/${product.id}`} className="block overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      data-ai-hint="aromatherapy product"
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
                  <CardDescription>
                    ${product.price.toFixed(2)}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/products/${product.id}`}>Ver Producto</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE BENEFICIOS --- */}
      {/* Muestra los beneficios clave de la aromaterapia. */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Beneficios de la Aromaterapia</h2>
            <p className="mt-2 text-lg text-muted-foreground">Transforma tu bienestar, un aroma a la vez.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex flex-col items-center p-6">
                {benefit.icon}
                <h3 className="font-headline text-2xl mt-4">{benefit.title}</h3>
                <p className="mt-2 text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DEL BLOG --- */}
      {/* Muestra los últimos 3 artículos del blog. */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">De Nuestro Blog</h2>
            <p className="mt-2 text-lg text-muted-foreground">Ideas e historias del mundo de la aromaterapia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 
              Se usa `.slice(0, 3)` para tomar solo los primeros 3 artículos.
              En una aplicación real, tu API debería tener un endpoint para `/articles?limit=3`.
            */}
            {blogArticles.slice(0, 3).map((article) => (
              <Card key={article.slug} className="overflow-hidden group">
                <Link href={`/blog/${article.slug}`}>
                  <CardHeader className="p-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      data-ai-hint="lifestyle wellness"
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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

      {/* --- SECCIÓN DE TESTIMONIOS --- */}
      {/* Muestra testimonios de clientes. */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground">Lo que Dicen Nuestros Clientes</h2>
            <p className="mt-2 text-lg text-muted-foreground">Historias reales de nuestra increíble comunidad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-8">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="flex mt-4 mb-2">
                  {/* Renderiza las estrellas de calificación. */}
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                  ))}
                </div>
                <CardContent className="p-0">
                  <p className="text-muted-foreground italic">&quot;{testimonial.comment}&quot;</p>
                  <p className="mt-4 font-semibold text-foreground">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
