import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground">
            Our Story
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A journey of passion, purity, and the power of scent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://picsum.photos/800/1000"
              alt="A person crafting aromatherapy products"
              data-ai-hint="artisan hands"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-3xl text-primary">From Nature, With Love</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AromaZen Boutique was born from a simple belief: that nature holds the key to wellness. We began as a small workshop, driven by a passion for botany and a deep respect for ancient aromatherapy traditions. Our founders traveled the world to source the purest ingredients, from the lavender fields of Provence to the sandalwood forests of India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to ethical sourcing, sustainability, and craftsmanship. Every product we offer is a testament to this commitment—hand-poured, hand-rolled, and blended with intention.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16 md:mt-24">
          <div className="space-y-6 md:order-2">
            <h2 className="font-headline text-3xl text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to help you create moments of peace and mindfulness in your everyday life. We believe that the simple act of lighting an incense stick or diffusing an essential oil can be a powerful ritual for self-care. 
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We aim to be more than just a store; we want to be a resource for your wellness journey. Through our products and our blog, we hope to inspire you to connect with the natural world and find your own personal sanctuary.
            </p>
          </div>
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden md:order-1">
            <Image
              src="https://picsum.photos/800/1001"
              alt="A serene landscape"
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
