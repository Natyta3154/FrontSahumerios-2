
import { getProducts, users, orders } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardTabs } from './dashboard-tabs';

// Esta página ahora solo muestra el contenido principal del dashboard.
// El layout general con la barra lateral está en /admin/layout.tsx
export default async function AdminDashboardPage() {
  
  // Obtenemos los datos de productos directamente en el servidor.
  const products = await getProducts();

  return (
    // Ya no se usa una Card para envolver todo, el layout principal lo maneja.
    <>
      <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl">Productos</h1>
            <p className="text-muted-foreground">Gestiona los productos de tu tienda.</p>
          </div>
      </div>
      {/* Pasamos los datos pre-cargados al componente que renderiza la tabla/contenido. */}
      <DashboardTabs products={products} users={users} orders={orders} />
    </>
  );
}
