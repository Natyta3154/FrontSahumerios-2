import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground">
            Nuestra Historia
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Un viaje de pasión, pureza y el poder del aroma.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://picsum.photos/800/1000"
              alt="Una persona elaborando productos de aromaterapia"
              data-ai-hint="artisan hands"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-3xl text-primary">De la Naturaleza, Con Amor</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AromaZen Boutique nació de una simple creencia: que la naturaleza tiene la llave del bienestar. Empezamos como un pequeño taller, impulsados por la pasión por la botánica y un profundo respeto por las antiguas tradiciones de la aromaterapia. Nuestros fundadores viajaron por el mundo para obtener los ingredientes más puros, desde los campos de lavanda de Provenza hasta los bosques de sándalo de la India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Estamos comprometidos con el abastecimiento ético, la sostenibilidad y la artesanía. Cada producto que ofrecemos es un testimonio de este compromiso: vertido a mano, enrollado a mano y mezclado con intención.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16 md:mt-24">
          <div className="space-y-6 md:order-2">
            <h2 className="font-headline text-3xl text-primary">Nuestra Misión</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nuestra misión es ayudarte a crear momentos de paz y atención plena en tu vida cotidiana. Creemos que el simple acto de encender una varita de incienso o difundir un aceite esencial puede ser un poderoso ritual de autocuidado.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro objetivo es ser más que una tienda; queremos ser un recurso para tu viaje de bienestar. A través de nuestros productos y nuestro blog, esperamos inspirarte a conectar con el mundo natural y encontrar tu propio santuario personal.
            </p>
          </div>
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden md:order-1">
            <Image
              src="https://picsum.photos/800/1001"
              alt="Un paisaje sereno"
              data-ai-hint="serene landscape"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
