
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFragrances } from "@/lib/data";
import { Fragrance } from "@/lib/types";

// TODO: Crear formulario y acciones para gestionar fragancias
export default async function AdminFragrancesPage() {
  const fragrances: Fragrance[] = await getFragrances();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Fragancias</h1>
          <p className="text-muted-foreground">Administra la lista de fragancias disponibles para tus productos.</p>
        </div>
        {/* Aquí irá el botón para añadir nueva fragancia */}
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Fragancias</CardTitle>
          <CardDescription>
            Aquí podrás añadir, editar y eliminar las fragancias que los clientes pueden seleccionar.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Aquí irá la tabla de fragancias */}
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}
