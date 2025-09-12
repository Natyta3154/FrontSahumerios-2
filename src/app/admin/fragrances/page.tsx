
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFragrancesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Fragancias</h1>
          <p className="text-muted-foreground">Administra la lista de fragancias disponibles para tus productos.</p>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Fragancias</CardTitle>
          <CardDescription>
            Esta sección está en construcción. Aquí podrás añadir, editar y eliminar las fragancias que los clientes pueden seleccionar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}
