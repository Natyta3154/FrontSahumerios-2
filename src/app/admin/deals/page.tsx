
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDealsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Ofertas</h1>
          <p className="text-muted-foreground">Crea y gestiona descuentos y promociones.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Ofertas</CardTitle>
          <CardDescription>
            Esta sección está en construcción. Aquí podrás configurar descuentos por porcentaje, ofertas 2x1 y más.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}
