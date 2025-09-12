
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeals } from "@/lib/data";
import { Deal } from "@/lib/types";

// TODO: Crear formulario y acciones para gestionar ofertas
export default async function AdminDealsPage() {
  const deals: Deal[] = await getDeals();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Ofertas</h1>
          <p className="text-muted-foreground">Crea y gestiona descuentos y promociones.</p>
        </div>
        {/* Aquí irá el botón para añadir nueva oferta */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Ofertas</CardTitle>
          <CardDescription>
            Aquí podrás configurar descuentos por porcentaje, ofertas 2x1 y más.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Aquí irá la tabla de ofertas */}
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}

