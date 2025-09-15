
"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HomeCarousel() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full">
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
      >
        <CarouselContent className="h-full">
          <CarouselItem className="h-full">
            <div className="relative h-full w-full">
              <Image
                src="https://picsum.photos/1600/900"
                alt="Varita de incienso brillante"
                data-ai-hint="incense stick"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
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
                sizes="100vw"
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
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>
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
  );
}
