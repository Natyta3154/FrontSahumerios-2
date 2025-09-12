
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAttributesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Atributos</h1>
          <p className="text-muted-foreground">Gestiona los atributos de los productos, como marcas o materiales.</p>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Atributos</CardTitle>
          <CardDescription>
            Esta sección está en construcción. Aquí podrás añadir, editar y eliminar atributos reutilizables para tus productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}
