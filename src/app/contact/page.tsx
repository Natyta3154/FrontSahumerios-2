import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground">
          Ponte en Contacto
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Nos encantaría saber de ti. Si tienes una pregunta sobre nuestros productos, colaboraciones o cualquier otra cosa, nuestro equipo está listo para responder a todas tus preguntas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-card p-8 rounded-lg">
          <h2 className="font-headline text-3xl mb-6">Formulario de Contacto</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" placeholder="Tu mensaje..." rows={5} />
            </div>
            <Button type="submit" className="w-full" size="lg">Enviar Mensaje</Button>
          </form>
        </div>
        
        <div className="space-y-8">
            <h2 className="font-headline text-3xl">Información de Contacto</h2>
            <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-muted-foreground">Envíanos un email para cualquier consulta.</p>
                    <a href="mailto:contact@aromazen.com" className="text-primary hover:underline">contact@aromazen.com</a>
                </div>
            </div>
             <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Teléfono</h3>
                    <p className="text-muted-foreground">Lun-Vie de 9am a 5pm.</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
                </div>
            </div>
             <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Nuestra Tienda</h3>
                    <p className="text-muted-foreground">123 Wellness Ave, Serenity City, 90210</p>
                    <a href="#" className="text-primary hover:underline">Obtener Direcciones</a>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
